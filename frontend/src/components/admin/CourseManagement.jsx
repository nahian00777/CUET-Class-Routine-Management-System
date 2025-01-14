import React, { useState } from 'react';
import { Plus, Edit2, Save } from 'lucide-react';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    creditHours: 3,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCourses(courses.map(c => c.id === editingId ? formData : c));
      setEditingId(null);
    } else {
      setCourses([...courses, formData]);
    }
    setFormData({ id: '', name: '', creditHours: 3 });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course ID
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              className="w-full p-2 border rounded"
              required
              placeholder="DEPT101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Hours
            </label>
            <select
              value={formData.creditHours}
              onChange={e => setFormData({ ...formData, creditHours: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            >
              <option value={0.75}>0.75</option>
              <option value={1.5}>1.5</option>
              <option value={3}>3.0</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? 'Update Course' : 'Add Course'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map(course => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap">{course.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.creditHours}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditingId(course.id);
                      setFormData(course);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}