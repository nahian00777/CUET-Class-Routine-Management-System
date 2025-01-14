import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function ViewRoutine() {
  const [query, setQuery] = useState({
    department: '',
    level: '',
    term: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically fetch the routine data based on the query
    console.log('Fetching routine for:', query);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Routine</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={query.department}
              onChange={e => setQuery({ ...query, department: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={query.level}
              onChange={e => setQuery({ ...query, level: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <select
              value={query.term}
              onChange={e => setQuery({ ...query, term: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Term</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
          View Routine
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">
          Select the department, level, and term to view the routine
        </p>
      </div>
    </div>
  );
}