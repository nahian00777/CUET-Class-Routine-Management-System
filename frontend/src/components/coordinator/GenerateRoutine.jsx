import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import QueryForm from '../shared/QueryForm';

// Mock data - replace with actual API calls
const mockCourses = [
  { id: 'CSE101', name: 'Introduction to Programming', creditHours: 3 },
  { id: 'CSE102', name: 'Data Structures', creditHours: 3 },
];

const mockTeachers = [
  { id: 'T1', name: 'John Doe', department: 'CSE' },
  { id: 'T2', name: 'Jane Smith', department: 'CSE' },
];

export default function GenerateRoutine() {
  const [query, setQuery] = useState({
    department: '',
    level: '',
    term: '',
  });
  const [assignments, setAssignments] = useState([]);

  const handleGenerate = () => {
    console.log('Generating routine with assignments:', assignments);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Routine</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <QueryForm query={query} onChange={setQuery} />
      </div>

      {query.department && query.level && query.term && (
        <>
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Course Assignments</h2>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-gray-500">{course.id}</p>
                  </div>
                  <select
                    className="w-64 p-2 border rounded"
                    value={assignments.find(a => a.courseId === course.id)?.teacherId || ''}
                    onChange={(e) => {
                      const teacherId = e.target.value;
                      setAssignments(prev => {
                        const filtered = prev.filter(a => a.courseId !== course.id);
                        if (teacherId) {
                          return [...filtered, { courseId: course.id, teacherId }];
                        }
                        return filtered;
                      });
                    }}
                  >
                    <option value="">Select Teacher</option>
                    {mockTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Wand2 className="h-5 w-5" />
            Generate Routine
          </button>
        </>
      )}
    </div>
  );
}