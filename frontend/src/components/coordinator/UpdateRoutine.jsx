import React, { useState } from "react";
// Make sure to import your PDF generator function from its module
import { generatePdfLabFirst } from "./routineGeneratorLabFirst";

// Demo arrays
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

// Define the display columns for the table header.
// We insert two gap columns:
// - A Break Time column inserted after the "9:50-10:40" slot (i.e. after grid index 2)
// - A Lunch Time column inserted after the "12:40-1:30" slot (i.e. after grid index 5)
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

// A sample routine for multiple sections.
// For lab courses, we mark type as "lab" and span as 3.
// Only the starting cell (isStart) is draggable.
const initialRoutine = {
  A: [
    { course: "111", day: "Sunday", time: "11:00-11:50", type: "theory", span: 1 },
    { course: "222", day: "Monday", time: "9:50-10:40", type: "theory", span: 1 },
    { course: "44", day: "Sunday", time: "2:30-3:20", type: "lab", span: 3 },
  ],
  B: [
    { course: "333", day: "Tuesday", time: "8:10-9:00", type: "theory", span: 1 },
    { course: "444", day: "Wednesday", time: "11:00-11:50", type: "lab", span: 3 },
  ],
};

// Build a grid object for a given section routine.
// Each day maps to an array (length = allTimeSlots.length).
// For lab courses, the first cell is flagged (isStart) and following cells are marked as merged.
function generateInitialGrid(routineSection) {
  const grid = {};
  days.forEach((day) => {
    grid[day] = Array(allTimeSlots.length).fill(null);
  });
  routineSection.forEach((entry) => {
    const { course, day, time, type, span } = entry;
    const index = allTimeSlots.indexOf(time);
    if (index !== -1) {
      if (type === "lab") {
        grid[day][index] = { course, type, span, isStart: true };
        for (let i = 1; i < span; i++) {
          grid[day][index + i] = { course, type, span, isMerged: true };
        }
      } else {
        grid[day][index] = { course, type, span: 1 };
      }
    }
  });
  return grid;
}

// Helper: Check if a lab course can be placed at a given index on a given day.
const canPlaceLabAt = (day, index, gridRow, span = 3) => {
  if (index + span > gridRow.length) return false;
  for (let i = 0; i < span; i++) {
    if (gridRow[index + i] !== null) return false;
  }
  return true;
};

const EditableRoutine = () => {
  // Manage the selected section.
  const sectionKeys = Object.keys(initialRoutine);
  const [selectedSection, setSelectedSection] = useState(sectionKeys[0]);

  // Build a grids object for each section.
  const [sectionGrids, setSectionGrids] = useState(() => {
    const initialGrids = {};
    sectionKeys.forEach((section) => {
      initialGrids[section] = generateInitialGrid(initialRoutine[section]);
    });
    return initialGrids;
  });

  // Build temporary slots for each section.
  const [sectionTempSlots, setSectionTempSlots] = useState(() => {
    const temp = {};
    sectionKeys.forEach((section) => {
      temp[section] = { tempLab: null, tempTheory: null };
    });
    return temp;
  });

  // dragData holds info about the dragged course.
  // It will include:
  // - origin: "grid" or "temp"
  // - If from grid: sourceDay and sourceIndex.
  // - course, type, span.
  const [dragData, setDragData] = useState(null);

  // Get the grid and temp slots for the currently selected section.
  const grid = sectionGrids[selectedSection];
  const { tempLab, tempTheory } = sectionTempSlots[selectedSection];

  // ---------- Handlers for Grid Cells ----------
  const handleGridDragStart = (e, day, index, cell) => {
    if (!cell || (cell.type === "lab" && !cell.isStart)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    setDragData({ origin: "grid", sourceDay: day, sourceIndex: index, ...cell });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleGridDrop = (e, targetDay, targetIndex) => {
    e.preventDefault();
    if (!dragData) return;

    const { origin, sourceDay, sourceIndex, course, type, span } = dragData;
    const targetRow = grid[targetDay];

    if (type === "theory") {
      if (targetRow[targetIndex] !== null) return;
    } else if (type === "lab") {
      if (!canPlaceLabAt(targetDay, targetIndex, targetRow, span)) return;
    }

    const newGrid = { ...grid };
    newGrid[targetDay] = [...newGrid[targetDay]];

    // Remove course from its origin.
    if (origin === "grid") {
      newGrid[sourceDay] = [...newGrid[sourceDay]];
      if (type === "lab") {
        newGrid[sourceDay][sourceIndex] = null;
        for (let i = 1; i < span; i++) {
          newGrid[sourceDay][sourceIndex + i] = null;
        }
      } else {
        newGrid[sourceDay][sourceIndex] = null;
      }
    } else if (origin === "temp") {
      // Update temporary slots for the section.
      setSectionTempSlots((prev) => ({
        ...prev,
        [selectedSection]: {
          ...prev[selectedSection],
          ...(type === "lab" ? { tempLab: null } : { tempTheory: null }),
        },
      }));
    }

    // Place the course at the target.
    if (type === "lab") {
      newGrid[targetDay][targetIndex] = { course, type, span, isStart: true };
      for (let i = 1; i < span; i++) {
        newGrid[targetDay][targetIndex + i] = { course, type, span, isMerged: true };
      }
    } else {
      newGrid[targetDay][targetIndex] = { course, type, span: 1 };
    }

    setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
    setDragData(null);
  };

  const renderCell = (day, index, cell) => {
    if (cell && cell.type === "lab" && cell.isMerged) return null;
    const colSpan = cell && cell.type === "lab" && cell.span ? cell.span : 1;
    return (
      <td
        key={index}
        colSpan={colSpan}
        className="border p-2 text-center"
        onDragOver={handleDragOver}
        onDrop={(e) => handleGridDrop(e, day, index)}
      >
        <div
          draggable={cell ? true : false}
          onDragStart={(e) => handleGridDragStart(e, day, index, cell)}
          className={`h-10 flex items-center justify-center rounded ${
            cell ? "bg-blue-300 cursor-move" : "bg-white"
          }`}
        >
          {cell ? cell.course : ""}
        </div>
      </td>
    );
  };

  // ---------- Handlers for Temporary Slots ----------
  const handleTempDragStart = (e, tempType, tempCourse) => {
    if (!tempCourse) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    setDragData({ origin: "temp", tempType, ...tempCourse });
  };

  const handleTempDrop = (e, tempType) => {
    e.preventDefault();
    if (!dragData) return;
    if (dragData.type !== tempType) return;

    const { origin, sourceDay, sourceIndex, course, type, span } = dragData;

    if (tempType === "lab") {
      if (tempLab) {
        if (origin === "grid") {
          const sourceRow = [...grid[sourceDay]];
          sourceRow[sourceIndex] = null;
          for (let i = 1; i < span; i++) {
            sourceRow[sourceIndex + i] = null;
          }
          if (!canPlaceLabAt(sourceDay, sourceIndex, sourceRow, tempLab.span)) return;
          const newGrid = { ...grid };
          newGrid[sourceDay] = sourceRow;
          newGrid[sourceDay][sourceIndex] = { ...tempLab, isStart: true };
          for (let i = 1; i < tempLab.span; i++) {
            newGrid[sourceDay][sourceIndex + i] = { ...tempLab, isMerged: true };
          }
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
          setSectionTempSlots((prev) => ({
            ...prev,
            [selectedSection]: { ...prev[selectedSection], tempLab: { course, type, span } },
          }));
        } else if (origin === "temp") {
          return;
        }
      } else {
        if (origin === "grid") {
          const newGrid = { ...grid };
          newGrid[sourceDay] = [...newGrid[sourceDay]];
          newGrid[sourceDay][sourceIndex] = null;
          for (let i = 1; i < span; i++) {
            newGrid[sourceDay][sourceIndex + i] = null;
          }
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
        }
        setSectionTempSlots((prev) => ({
          ...prev,
          [selectedSection]: { ...prev[selectedSection], tempLab: { course, type, span } },
        }));
      }
    } else if (tempType === "theory") {
      if (tempTheory) {
        if (origin === "grid") {
          const newGrid = { ...grid };
          newGrid[sourceDay] = [...newGrid[sourceDay]];
          newGrid[sourceDay][sourceIndex] = { ...tempTheory, type: "theory", span: 1 };
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
          setSectionTempSlots((prev) => ({
            ...prev,
            [selectedSection]: { ...prev[selectedSection], tempTheory: { course, type, span: 1 } },
          }));
        } else if (origin === "temp") {
          return;
        }
      } else {
        if (origin === "grid") {
          const newGrid = { ...grid };
          newGrid[sourceDay] = [...newGrid[sourceDay]];
          newGrid[sourceDay][sourceIndex] = null;
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
        }
        setSectionTempSlots((prev) => ({
          ...prev,
          [selectedSection]: { ...prev[selectedSection], tempTheory: { course, type, span: 1 } },
        }));
      }
    }
    setDragData(null);
  };

  // ----------- Generate PDF Handler -----------
  const handleGeneratePdf = async () => {
    const modifiedRoutine = {};
    // Loop through every section
    Object.keys(sectionGrids).forEach((section) => {
      modifiedRoutine[section] = [];
      const grid = sectionGrids[section];
      Object.keys(grid).forEach((day) => {
        grid[day].forEach((cell, index) => {
          if (cell) {
            modifiedRoutine[section].push([cell.course, day, allTimeSlots[index]]);
          }
        });
      });
    });
    await generatePdfLabFirst(modifiedRoutine, "modifiedRoutine.pdf");
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Editable Routine</h2>

      {/* Section Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Section:</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border p-1 rounded"
        >
          {sectionKeys.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Day / Time</th>
            {displayColumns.map((col, idx) => (
              <th key={idx} className="border p-2 text-center">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIdx) => (
            <tr key={day}>
              <td className="border p-2 font-semibold">{day}</td>
              {displayColumns.map((col, idx) => {
                if (col.type === "time") {
                  return renderCell(day, col.gridIndex, grid[day][col.gridIndex]);
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
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-gray-500">
        Drag and drop a course to move it to an empty grid cell (for lab courses, three consecutive cells are required), or drop it into a temporary slot to hold/swap.
      </p>

      {/* Temporary Slots Section */}
      <div className="mt-6 flex flex-col sm:flex-row justify-around items-center gap-6">
        {/* Temporary Lab Slot */}
        <div
          className="w-64 h-20 border-dashed border-2 flex items-center justify-center rounded bg-gray-50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleTempDrop(e, "lab")}
        >
          {tempLab ? (
            <div
              draggable
              onDragStart={(e) => handleTempDragStart(e, "lab", tempLab)}
              className="w-full h-full flex items-center justify-center bg-blue-300 rounded cursor-move text-lg font-semibold"
            >
              {tempLab.course}
            </div>
          ) : (
            <span className="text-gray-500 text-lg font-semibold">Temp Lab Slot</span>
          )}
        </div>

        {/* Temporary Theory Slot */}
        <div
          className="w-48 h-16 border-dashed border-2 flex items-center justify-center rounded bg-gray-50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleTempDrop(e, "theory")}
        >
          {tempTheory ? (
            <div
              draggable
              onDragStart={(e) => handleTempDragStart(e, "theory", tempTheory)}
              className="w-full h-full flex items-center justify-center bg-blue-300 rounded cursor-move text-lg font-semibold"
            >
              {tempTheory.course}
            </div>
          ) : (
            <span className="text-gray-500 text-lg font-semibold">Temp Theory Slot</span>
          )}
        </div>
      </div>

      {/* Generate PDF Button */}
      <button
        onClick={handleGeneratePdf}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default EditableRoutine;
