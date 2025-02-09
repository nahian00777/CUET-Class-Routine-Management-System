import React, { useState } from "react";
import { Trash2, X, Plus, Check } from "lucide-react";
import RoutineGeneratorr from "./RoutineGeneratorr";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const TIME_SLOTS = ['8:10', '9:00', '9:50', '11:00', '11:50', '12:40', '2:30', '3:20', '4:10'];

function GenerateRoutine() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [editingCourseIndex, setEditingCourseIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    course_code: "",
    credits: 0,
    is_lab: false,
    time_slots: [],
  });

  const handleAddCourse = () => {
    if (!newCourse.course_code) return;
    setCourses([...courses, { ...newCourse, time_slots: [] }]);
    setNewCourse({
      course_code: "",
      credits: 0,
      is_lab: false,
      time_slots: [],
    });
    setShowNewCourseForm(false);
  };

  const toggleTimeSlot = (day, time) => {
    const slotString = `${day} ${time}`;
    setSelectedSlots((prev) =>
      prev.includes(slotString)
        ? prev.filter((slot) => slot !== slotString)
        : [...prev, slotString]
    );
  };

  const isExistingSlot = (courseIndex, slot) => {
    return courses[courseIndex].time_slots.includes(slot);
  };

  const confirmSelectedSlots = () => {
    const newCourses = [...courses];
    newCourses[editingCourseIndex].time_slots = [
      ...newCourses[editingCourseIndex].time_slots,
      ...selectedSlots,
    ];
    setCourses(newCourses);
    setShowModal(false);
    setSelectedSlots([]);
  };

  const formatCoursesForRoutine = () => {
    const regularCourses = courses
      .filter((course) => !course.is_lab)
      .map((course) => {
        // Group time slots by day
        const preferred_slots = course.time_slots.reduce((acc, slot) => {
          const [day, time] = slot.split(" ");
          if (!acc[day]) acc[day] = [];
          acc[day].push(`${time}-${add50Minutes(time)}`);
          return acc;
        }, {});


        // Convert to the required format
        return {
          course_code: course.course_code,
          credits: course.credits,
          preferred_slots: Object.entries(preferred_slots).flatMap(
            ([day, slots]) => slots.map((slot) => [day, slot])
          ),
        };
      });


    const labCourses = courses
      .filter((course) => course.is_lab)
      .map((course) => {
        // Group time slots by day
        const preferred_slots = course.time_slots.reduce((acc, slot) => {
          const [day, time] = slot.split(" ");
          if (!acc[day]) acc[day] = [];
          acc[day].push(`${time}-${add50Minutes(time)}`);
          return acc;
        }, {});


        // Convert to the required format
        return {
          course_code: course.course_code,
          credits: course.credits,
          preferred_slots: Object.entries(preferred_slots).map(
            ([day, slots]) => [day, slots]
          ),
        };
      });


    return { regularCourses, labCourses };
  };


  // Helper function to add 50 minutes to a time string
  const add50Minutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    date.setMinutes(date.getMinutes() + 50);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Course Schedule Manager
        </h1>
        <button
          onClick={() => setShowNewCourseForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-10 w-7 mr-1" />
          Add Course
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Slots
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course, courseIndex) => (
              <tr key={courseIndex}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        const newCourses = courses.filter(
                          (_, index) => index !== courseIndex
                        );
                        setCourses(newCourses);
                      }}
                      className="mr-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {course.course_code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.is_lab ? "Lab" : "Lecture"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.credits}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {course.time_slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="inline-flex items-center bg-gray-100 rounded-md"
                      >
                        <span className="px-3 py-1 text-sm">{slot}</span>
                        <button
                          onClick={() => {
                            const newCourses = [...courses];
                            newCourses[courseIndex].time_slots =
                              course.time_slots.filter(
                                (_, i) => i !== slotIndex
                              );
                            setCourses(newCourses);
                          }}
                          className="p-1 hover:bg-gray-200 rounded-r-md"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      setEditingCourseIndex(courseIndex);
                      setSelectedSlots([]);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Slots
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <RoutineGeneratorr
        <RoutineGeneratorr
          courses={formatCoursesForRoutine().regularCourses}
          labCourses={formatCoursesForRoutine().labCourses}
        />
      </div>

      {/* Time Slot Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Select Time Slots for Course{" "}
                  {courses[editingCourseIndex].course_code}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSlots([]);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>


              <div className="grid grid-cols-6 gap-2 mb-6">
                <div className="col-span-1"></div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center font-medium text-sm text-gray-700"
                  >
                    {day}
                  </div>
                ))}

                {TIME_SLOTS.map(time => (
                  <React.Fragment key={time}>
                    <div className="text-right text-sm text-gray-500 pr-2 py-1">
                      {time}
                    </div>
                    {DAYS.map((day) => {
                      const slotString = `${day} ${time}`;
                      const isSelected = selectedSlots.includes(slotString);
                      const isExisting = isExistingSlot(editingCourseIndex, slotString);

                      return (
                        <button
                          key={`${day}-${time}`}
                          onClick={() => toggleTimeSlot(day, time)}
                          disabled={isExisting}
                          className={`w-full h-8 rounded-md transition-colors ${isSelected
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : isExisting
                                ? 'bg-green-100'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                          {isSelected && (
                            <Check className="h-4 w-4 mx-auto text-white" />
                          )}
                          {isExisting && (
                            <Check className="h-4 w-4 mx-auto text-green-600" />
                          )}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-md"></div>
                    <span className="text-sm text-gray-600">
                      Already selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-600 rounded-md"></div>
                    <span className="text-sm text-gray-600">New selection</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedSlots([]);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSelectedSlots}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Confirm Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Course Modal */}
      {showNewCourseForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Course</h2>
                <button
                  onClick={() => setShowNewCourseForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="courseCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course Code
                  </label>
                  <input
                    type="text"
                    id="courseCode"
                    value={newCourse.course_code}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, course_code: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="credits"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Credits
                  </label>
                  <select
                    id="credits"
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isLab"
                    checked={newCourse.is_lab}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        is_lab: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isLab"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Is Lab Course
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewCourseForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourse}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Add Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateRoutine;
