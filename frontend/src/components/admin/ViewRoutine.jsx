import React, { useState } from "react";
import { Search } from "lucide-react";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const allTimeSlots = [
  "8:10-9:00",
  "9:00-9:50",
  "9:50-10:40",
  "11:00-11:50",
  "11:50-12:40",
  "12:40-1:30",
  "2:30-3:20",
  "3:20-4:10",
  "4:10-5:00",
];

const displayColumns = [
  { type: "time", label: "8:10-9:00", gridIndex: 0 },
  { type: "time", label: "9:00-9:50", gridIndex: 1 },
  { type: "time", label: "9:50-10:40", gridIndex: 2 },
  { type: "gap", label: "Break Time" },
  { type: "time", label: "11:00-11:50", gridIndex: 3 },
  { type: "time", label: "11:50-12:40", gridIndex: 4 },
  { type: "time", label: "12:40-1:30", gridIndex: 5 },
  { type: "gap", label: "Lunch Time" },
  { type: "time", label: "2:30-3:20", gridIndex: 6 },
  { type: "time", label: "3:20-4:10", gridIndex: 7 },
  { type: "time", label: "4:10-5:00", gridIndex: 8 },
];

// Sample routine data
const sampleRoutine = {
  A: [
    {
      course: "111",
      day: "Sunday",
      time: "11:00-11:50",
      type: "theory",
      span: 1,
    },
    {
      course: "222",
      day: "Monday",
      time: "9:50-10:40",
      type: "theory",
      span: 1,
    },
    { course: "44", day: "Sunday", time: "2:30-3:20", type: "lab", span: 3 },
  ],
  B: [
    {
      course: "333",
      day: "Tuesday",
      time: "8:10-9:00",
      type: "theory",
      span: 1,
    },
    {
      course: "444",
      day: "Wednesday",
      time: "11:00-11:50",
      type: "lab",
      span: 3,
    },
  ],
  C: [
    {
      course: "333",
      day: "Tuesday",
      time: "8:10-9:00",
      type: "theory",
      span: 1,
    },
    {
      course: "444",
      day: "Wednesday",
      time: "11:00-11:50",
      type: "lab",
      span: 3,
    },
  ],
};

const buildGridFromRoutine = (sectionRoutine) => {
  const grid = {};
  days.forEach((day) => {
    grid[day] = Array(allTimeSlots.length).fill("");
  });
  sectionRoutine.forEach((entry) => {
    const { course, day, time } = entry;
    const idx = allTimeSlots.indexOf(time);
    if (idx !== -1) {
      grid[day][idx] = course;
    }
  });
  return grid;
};

const renderRow = (day, dayIdx, grid) => {
  return (
    <tr key={day} className="bg-white">
      <td className="border p-2 font-semibold text-sm bg-gray-50">{day}</td>
      {displayColumns.map((col, idx) => {
        if (col.type === "time") {
          return (
            <td key={idx} className="border p-2 text-center text-sm">
              {grid[day][col.gridIndex]}
            </td>
          );
        } else if (col.type === "gap") {
          if (dayIdx === 0) {
            return (
              <td
                key={idx}
                rowSpan={days.length}
                className="border p-2 text-center bg-gray-100 text-lg font-semibold"
              >
                {col.label}
              </td>
            );
          } else {
            return null;
          }
        }
        return null;
      })}
    </tr>
  );
};

export default function ViewRoutine() {
  const [query, setQuery] = useState({
    department: "",
    level: "",
    term: "",
  });
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate fetching routine data based on the query
    console.log("Fetching routine for:", query);
    // For demonstration, we'll just use the sampleRoutine
    setSelectedRoutine(sampleRoutine);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Routine</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={query.department}
              onChange={(e) =>
                setQuery({ ...query, department: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={query.level}
              onChange={(e) => setQuery({ ...query, level: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <select
              value={query.term}
              onChange={(e) => setQuery({ ...query, term: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Term</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
          View Routine
        </button>
      </form>

      {selectedRoutine ? (
        <div className="space-y-10">
          {Object.keys(selectedRoutine).map((section) => {
            const grid = buildGridFromRoutine(selectedRoutine[section]);
            return (
              <div
                key={section}
                className="shadow-lg rounded-lg overflow-hidden bg-white"
              >
                <h2 className="text-2xl font-bold bg-blue-500 text-white p-4">
                  Routine for {section}
                </h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Day / Time
                      </th>
                      {displayColumns.map((col, idx) => {
                        if (col.type === "time") {
                          return (
                            <th
                              key={idx}
                              className="px-4 py-2 text-center text-sm font-bold text-gray-700"
                            >
                              {col.label}
                            </th>
                          );
                        } else if (col.type === "gap") {
                          return (
                            <th
                              key={idx}
                              className="px-4 py-2 text-center text-lg font-bold text-gray-700 bg-gray-300"
                            >
                              {col.label}
                            </th>
                          );
                        }
                        return null;
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {days.map((day, idx) => renderRow(day, idx, grid))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">
            Select the department, level, and term to view the routine
          </p>
        </div>
      )}
    </div>
  );
}
