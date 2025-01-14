import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const TIME_SLOTS = [
  '8:00 AM', '8:50 AM', '9:40 AM', '10:30 AM', '11:20 AM',
  '12:10 PM', '1:00 PM', '1:50 PM', '2:40 PM', '3:30 PM'
];

export default function TimePreferences() {
  const [preferences, setPreferences] = useState([]);

  const handleAddSlot = () => {
    setPreferences([
      ...preferences,
      { day: DAYS[0], startTime: TIME_SLOTS[0], endTime: TIME_SLOTS[1] }
    ]);
  };

  const handleRemoveSlot = (index) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const teacherPreference = {
      teacherId: 'T1', // Replace with actual teacher ID
      timeSlots: preferences,
    };
    console.log('Saving preferences:', teacherPreference);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Set Time Preferences</h1>
        <button
          onClick={handleAddSlot}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {preferences.map((slot, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <select
                  value={slot.day}
                  onChange={(e) => {
                    const newPreferences = [...preferences];
                    newPreferences[index] = { ...slot, day: e.target.value };
                    setPreferences(newPreferences);
                  }}
                  className="w-full p-2 border rounded"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={slot.startTime}
                  onChange={(e) => {
                    const newPreferences = [...preferences];
                    newPreferences[index] = { ...slot, startTime: e.target.value };
                    setPreferences(newPreferences);
                  }}
                  className="w-full p-2 border rounded"
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={slot.endTime}
                  onChange={(e) => {
                    const newPreferences = [...preferences];
                    newPreferences[index] = { ...slot, endTime: e.target.value };
                    setPreferences(newPreferences);
                  }}
                  className="w-full p-2 border rounded"
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleRemoveSlot(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}

          {preferences.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No time preferences set. Click "Add Time Slot" to begin.
            </p>
          )}
        </div>

        {preferences.length > 0 && (
          <button
            onClick={handleSave}
            className="mt-6 flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <Save className="h-5 w-5" />
            Save Preferences
          </button>
        )}
      </div>
    </div>
  );
}