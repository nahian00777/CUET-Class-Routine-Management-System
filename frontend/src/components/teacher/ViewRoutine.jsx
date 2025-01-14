import React from 'react';

const mockRoutine = [
  {
    day: 'Sunday',
    slots: [
      { time: '8:00 AM - 8:50 AM', courseId: 'CSE101', room: '301', batch: 'CSE 2020' },
      { time: '9:00 AM - 9:50 AM', courseId: 'CSE102', room: '302', batch: 'CSE 2021' },
    ],
  },
  {
    day: 'Monday',
    slots: [
      { time: '11:00 AM - 11:50 AM', courseId: 'CSE103', room: '303', batch: 'CSE 2020' },
    ],
  },
  // Add more days as needed
];

export default function ViewRoutine() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Teaching Schedule</h1>
      
      <div className="space-y-6">
        {mockRoutine.map((daySchedule) => (
          <div key={daySchedule.day} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{daySchedule.day}</h2>
            </div>
            {daySchedule.slots.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Batch
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {daySchedule.slots.map((slot, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.courseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.batch}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-4 text-sm text-gray-500">
                No classes scheduled for this day
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}