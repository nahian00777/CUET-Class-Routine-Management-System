import React from "react";
import { useState, useEffect } from "react";

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

const ViewRoutine = ()=> {

const [routine, setRoutine] = useState({});

  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        const term = 'Term 1';
        const level = 'Level 1';
        const department = 'CSE';

        const response = await fetch('http://localhost:3000/api/v1/schedules/getSchedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            term,
            level,
            department,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch routine data');
        }

        const data = await response.json();

        setRoutine(data.data); // Assuming the data is in the `data` field of the response
        // setRoutine(demo_routine); 
      } catch (error) {
        console.error('Error fetching routine data:', error);
      }
    };

    fetchRoutineData();
  }, []);

  


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

  // Render a single row based on displayColumns.
  // Gap columns are rendered only once (on the first row) using rowSpan.
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
            // Render gap cell only for the first row.
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

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      {Object.keys(routine).map((section) => {
        const grid = buildGridFromRoutine(routine[section]);
        return (
          <div key={section} className="shadow-lg rounded-lg overflow-hidden bg-white">
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
  );
};

export default ViewRoutine;
