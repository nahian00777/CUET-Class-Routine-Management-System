import React from 'react';

export default function TermSelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Term
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Term</option>
        <option value="1">Term 1</option>
        <option value="2">Term 2</option>
      </select>
    </div>
  );
}