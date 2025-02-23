import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    courseID: "",
    courseName: "",
    creditHours: 3,
    courseType: "Theory", // Default value
  });
  const [searchQuery, setSearchQuery] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/courses/getCourse`
        );
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Error fetching courses.");
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        await axios.patch( `${apiUrl}/api/v1/courses/updateCourse`, {
          prevCourseID: editingId,
          courseID: formData.courseID,
          courseName: formData.courseName,
          creditHours: formData.creditHours,
          courseType: formData.courseType,
        });
        setCourses(
          courses.map((c) => (c.courseID === editingId ? formData : c))
        );
        setEditingId(null);
        setFormData({
          courseID: "",
          courseName: "",
          creditHours: 3,
          courseType: "Theory",
        });
        toast.success("Course updated successfully.");
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Error updating course.");
      }
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/courses/addCourse`,
          {
            courseID: formData.courseID,
            courseName: formData.courseName,
            creditHours: formData.creditHours,
            courseType: formData.courseType,
          }
        );
        setCourses([...courses, response.data.data]);
        setFormData({
          courseID: "",
          courseName: "",
          creditHours: 3,
          courseType: "Theory",
        });
        toast.success("Course added successfully.");
      } catch (error) {
        console.error("Error adding course:", error);
        toast.error("Error adding course.");
      }
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.courseID);
    setFormData({
      courseID: course.courseID,
      courseName: course.courseName,
      creditHours: course.creditHours,
      courseType: course.courseType,
    });
  };

  const handleDelete = async (courseID) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/courses/deleteCourse`, {
        data: { courseID },
      });
      setCourses(courses.filter((course) => course.courseID !== courseID));
      toast.success("Course deleted successfully.");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course.");
    }
  };

  // Filter courses based on the search query
  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              value={formData.courseName}
              onChange={(e) =>
                setFormData({ ...formData, courseName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              placeholder="Enter Course Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course ID
            </label>
            <input
              type="text"
              value={formData.courseID}
              onChange={(e) =>
                setFormData({ ...formData, courseID: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              placeholder="Enter Course ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Hours
            </label>
            <select
              value={formData.creditHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  creditHours: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3.0</option>
              <option value={4}>4.0</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              value={formData.courseType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  courseType: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="Theory">Theory</option>
              <option value="Sessional">Sessional</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {editingId ? "Update Course" : "Add Course"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Course Name or ID"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.courseID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.courseID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.creditHours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.courseType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.courseID)}
                    className="pl-4 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
}
