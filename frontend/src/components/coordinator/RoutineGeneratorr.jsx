import React,{useState} from "react";
import {
  generateRoutine,
  generatePdf,
} from "./routineGenerator";
import {
  generateRoutineLabFirst,
  generatePdfLabFirst,
} from "./routineGeneratorLabFirst"; 

const RoutineGeneratorr = (props) => {
  const [numSections, setNumSections] = useState(3);
  var courses = [
    {
      course_code: "111",
      credits: 1,
      preferred_slots: [
        ["Tuesday", "9:00-9:50"],
        ["Sunday", "11:00-11:50"],
        ["Monday", "11:50-12:40"],
        ["Wednesday", "9:50-10:40"]
      ]
    },
    {
      course_code: "222",
      credits: 1,
      preferred_slots: [
        ["Wednesday", "11:00-11:50"],
        ["Thursday", "9:00-9:50"],
        ["Sunday", "9:00-9:50"],
        ["Monday", "9:50-10:40"]
      ]
    }
  ];
  courses=props.courses;
  var labCourses = [
    {
      course_code: "44",
      credits: 1.5,
      preferred_slots: [
        ["Sunday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]],
        ["Monday", ["11:00-11:50", "11:50-12:40", "12:40-1:30"]],
        ["Monday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]]
      ]
    },
    {
      course_code: "55",
      credits: 0.75,
      preferred_slots: [
        ["Wednesday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]],
        ["Wednesday", ["11:00-11:50", "11:50-12:40", "12:40-1:30"]],
        ["Thursday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]]
      ]
    }
  ];
    labCourses=props.labCourses;
  const handleGenerateRoutine = () => {
    //const numSections = 3; // You can make this dynamic
    const routine = generateRoutine(courses, labCourses, numSections);
    generatePdf(routine);
  };

  const handleGenerateRoutineLabFirst = () => {
    //const numSections = 3; // You can make this dynamic
    const routine2 = generateRoutineLabFirst(courses, labCourses, numSections);
    generatePdfLabFirst(routine2);
  };

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="sections" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Sections
        </label>
        <input
          type="number"
          id="sections"
          min="1"
          value={numSections}
          onChange={(e) => setNumSections(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <button 
        onClick={handleGenerateRoutine}
        className="mb-4 w-full py-4 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Generate Routine (Priority is given to Theory Courses)
      </button>
      
      
      <button 
        onClick={handleGenerateRoutineLabFirst}
        className="w-full py-4 bg-green-300 text-white rounded hover:bg-green-400"
      >
        Generate Routine (Priority is given to Lab Courses)
      </button>
    </div>
  );
};

export default RoutineGeneratorr;
