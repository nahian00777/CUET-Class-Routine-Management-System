import React, { useState } from 'react';
import { Save } from 'lucide-react';
import QueryForm from '../shared/QueryForm';

const mockRoutine = [
  {
    day: 'Sunday',
    time: '8:00 AM',
    courseId: 'CSE101',
    teacherId: 'T1',
    room: '301',
  },
];

export default function UpdateRoutine() {
  const [query, setQuery] = useState({
    department: '',
    level: '',
    term: '',
  });

  const handleUpdate = () => {
    console.log('Updating routine');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Update Routine</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <QueryForm query={query} onChange={setQuery} />
      </div>

      {query.department && query.level && query.term && (
        <>
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Room
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockRoutine.map((cell, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{cell.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cell.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cell.courseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cell.teacherId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cell.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </>
      )}
    </div>
  );
}