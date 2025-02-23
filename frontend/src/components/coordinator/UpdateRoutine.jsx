import { useState, useEffect } from "react";
import { generatePdf } from "./routineGenerator";

// Days and time slots arrays
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

// Display columns for the table header, with two gap columns for break/lunch.
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

/**
 * Generates the initial grid for a section.
 * For lab courses, the default span is 3 (if not provided) and they are merged.
 */
const generateInitialGrid = (routineSection) => {
  const grid = {};
  days.forEach((day) => {
    grid[day] = Array(allTimeSlots.length).fill(null);
  });

  routineSection.forEach((entry) => {
    // For lab courses, default span is 3; theory courses always span 1.
    const { course, day, time, type, span = type === "lab" ? 3 : 1 } = entry;
    const index = allTimeSlots.indexOf(time);
    if (index !== -1) {
      if (type === "lab") {
        if (canPlaceLabAt(day, index, grid[day], span)) {
          grid[day][index] = { course, type, span, isStart: true };
          for (let i = 1; i < span; i++) {
            grid[day][index + i] = { course, type, span, isMerged: true };
          }
        }
      } else {
        grid[day][index] = { course, type, span: 1 };
      }
    }
  });
  return grid;
};

/**
 * Checks if a lab course can be placed at the given index on the specified day.
 */
const canPlaceLabAt = (day, index, gridRow, span = 3) => {
  if (index + span > gridRow.length) return false;
  for (let i = 0; i < span; i++) {
    if (gridRow[index + i] !== null) return false;
  }
  return true;
};

const UpdateRoutine = () => {
  // State to hold the routine data (sections A and B, for example)
  const [routineData, setRoutineData] = useState({
    A: [],
    B: [],
  });
  // Selected section identifier.
  const [selectedSection, setSelectedSection] = useState("A");
  // The grid for each section.
  const [sectionGrids, setSectionGrids] = useState({});
  // Temporary slots for each section (for lab and theory courses).
  const [sectionTempSlots, setSectionTempSlots] = useState({});
  // Holds the current drag data.
  const [dragData, setDragData] = useState(null);

  // Fetch routine data on component mount.
  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/v1/schedules/getSchedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            term: "Term 1",
            level: "Level 1",
            department: "CSE",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRoutineData(data.data);
        }
      } catch (error) {
        console.error("Error fetching routine data:", error);
      }
    };

    fetchRoutineData();
  }, []);

  // Update grids and temporary slots whenever routineData changes.
  useEffect(() => {
    const sectionKeys = Object.keys(routineData);
    const newGrids = {};
    const newTempSlots = {};

    sectionKeys.forEach((section) => {
      newGrids[section] = generateInitialGrid(routineData[section]);
      newTempSlots[section] = { tempLab: null, tempTheory: null };
    });

    setSectionGrids(newGrids);
    setSectionTempSlots(newTempSlots);
    if (sectionKeys.length > 0) setSelectedSection(sectionKeys[0]);
  }, [routineData]);

  // Get the grid and temporary slots for the currently selected section.
  const grid = sectionGrids[selectedSection] || {};
  const { tempLab, tempTheory } = sectionTempSlots[selectedSection] || {};

  // ---------- Handlers for Grid Cells ----------
  const handleGridDragStart = (e, day, index, cell) => {
    // Prevent dragging if the cell is empty or a merged part of a lab.
    if (!cell || (cell.type === "lab" && !cell.isStart)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    setDragData({
      origin: "grid",
      sourceDay: day,
      sourceIndex: index,
      ...cell,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleGridDrop = (e, targetDay, targetIndex) => {
    e.preventDefault();
    if (!dragData || !grid[targetDay]) return;

    const { origin, sourceDay, sourceIndex, course, type, span } = dragData;
    const targetRow = grid[targetDay];

    // For theory courses, ensure the target cell is empty.
    if (type === "theory") {
      if (targetRow[targetIndex] !== null) return;
    } else if (type === "lab") {
      // For lab courses, ensure there is room for the entire span.
      if (!canPlaceLabAt(targetDay, targetIndex, targetRow, span)) return;
    }

    const newGrid = { ...grid };
    newGrid[targetDay] = [...targetRow];

    // Remove the course from its origin.
    if (origin === "grid") {
      newGrid[sourceDay] = [...newGrid[sourceDay]];
      if (type === "lab") {
        for (let i = 0; i < span; i++) {
          newGrid[sourceDay][sourceIndex + i] = null;
        }
      } else {
        newGrid[sourceDay][sourceIndex] = null;
      }
    } else if (origin === "temp") {
      // If the course was in a temporary slot, clear that slot.
      setSectionTempSlots((prev) => ({
        ...prev,
        [selectedSection]: {
          ...prev[selectedSection],
          ...(type === "lab" ? { tempLab: null } : { tempTheory: null }),
        },
      }));
    }

    // Place the course at the target location.
    if (type === "lab") {
      for (let i = 0; i < span; i++) {
        newGrid[targetDay][targetIndex + i] =
          i === 0
            ? { course, type, span, isStart: true }
            : { course, type, span, isMerged: true };
      }
    } else {
      newGrid[targetDay][targetIndex] = { course, type, span: 1 };
    }

    setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
    setDragData(null);
  };

  // Render a single grid cell. Merged (non-start) lab cells are skipped.
  const renderCell = (day, index, cell) => {
    if (cell && cell.type === "lab" && cell.isMerged) return null;
    const colSpan = cell && cell.type === "lab" && cell.span ? cell.span : 1;

    return (
      <td
        key={`${day}-${index}`}
        colSpan={colSpan}
        className="border p-2 text-center"
        onDragOver={handleDragOver}
        onDrop={(e) => handleGridDrop(e, day, index)}
      >
        <div
          draggable={!!cell}
          onDragStart={(e) => handleGridDragStart(e, day, index, cell)}
          className={`h-10 flex items-center justify-center rounded ${
            cell
              ? cell.type === "lab"
                ? "bg-green-300"
                : "bg-blue-300 cursor-move"
              : "bg-white"
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
          for (let i = 0; i < span; i++) {
            sourceRow[sourceIndex + i] = null;
          }
          if (!canPlaceLabAt(sourceDay, sourceIndex, sourceRow, tempLab.span))
            return;
          const newGrid = { ...grid };
          newGrid[sourceDay] = sourceRow;
          newGrid[sourceDay][sourceIndex] = { ...tempLab, isStart: true };
          for (let i = 1; i < tempLab.span; i++) {
            newGrid[sourceDay][sourceIndex + i] = {
              ...tempLab,
              isMerged: true,
            };
          }
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
          setSectionTempSlots((prev) => ({
            ...prev,
            [selectedSection]: {
              ...prev[selectedSection],
              tempLab: { course, type, span },
            },
          }));
        } else if (origin === "temp") {
          return;
        }
      } else {
        if (origin === "grid") {
          const newGrid = { ...grid };
          newGrid[sourceDay] = [...newGrid[sourceDay]];
          for (let i = 0; i < span; i++) {
            newGrid[sourceDay][sourceIndex + i] = null;
          }
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
        }
        setSectionTempSlots((prev) => ({
          ...prev,
          [selectedSection]: {
            ...prev[selectedSection],
            tempLab: { course, type, span },
          },
        }));
      }
    } else if (tempType === "theory") {
      if (tempTheory) {
        if (origin === "grid") {
          const newGrid = { ...grid };
          newGrid[sourceDay] = [...newGrid[sourceDay]];
          newGrid[sourceDay][sourceIndex] = {
            ...tempTheory,
            type: "theory",
            span: 1,
          };
          setSectionGrids((prev) => ({ ...prev, [selectedSection]: newGrid }));
          setSectionTempSlots((prev) => ({
            ...prev,
            [selectedSection]: {
              ...prev[selectedSection],
              tempTheory: { course, type, span: 1 },
            },
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
          [selectedSection]: {
            ...prev[selectedSection],
            tempTheory: { course, type, span: 1 },
          },
        }));
      }
    }
    setDragData(null);
  };

  // ---------- Generate PDF Handler ----------
  const handleGeneratePdf = async () => {
    const modifiedRoutine = {};
    // Loop through each section and extract cell data.
    Object.keys(sectionGrids).forEach((section) => {
      modifiedRoutine[section] = [];
      const grid = sectionGrids[section];
      Object.keys(grid).forEach((day) => {
        grid[day].forEach((cell, index) => {
          if (cell) {
            modifiedRoutine[section].push([
              cell.course,
              day,
              allTimeSlots[index],
            ]);
          }
        });
      });
    });
    await generatePdf(modifiedRoutine, "modifiedRoutine.pdf");
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
          {Object.keys(routineData).map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      {/* Routine Table */}
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
                  return renderCell(
                    day,
                    col.gridIndex,
                    grid[day]?.[col.gridIndex]
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
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-gray-500">
        Drag and drop a course to move it to an empty grid cell (for lab
        courses, three consecutive cells are required), or drop it into a
        temporary slot to hold/swap.
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
            <span className="text-gray-500 text-lg font-semibold">
              Temp Lab Slot
            </span>
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
            <span className="text-gray-500 text-lg font-semibold">
              Temp Theory Slot
            </span>
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

export default UpdateRoutine;
