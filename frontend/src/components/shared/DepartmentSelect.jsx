import React from 'react';

export default function DepartmentSelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Department
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Department</option>
        <option value="CSE">CSE</option>
        <option value="EEE">EEE</option>
        <option value="ME">ME</option>
      </select>
    </div>
  );
}