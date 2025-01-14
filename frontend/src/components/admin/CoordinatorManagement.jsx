import React, { useState } from 'react';
import { Plus, Edit2, Save } from 'lucide-react';

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    assignedBatch: '', // You can use null or an empty string based on your preference
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCoordinators(coordinators.map(c => c.id === editingId ? formData : c));
      setEditingId(null);
    } else {
      setCoordinators([...coordinators, formData]);
    }
    setFormData({ id: '', name: '', department: '', assignedBatch: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assign Course Coordinators</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordinator ID
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
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
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Batch
            </label>
            <input
              type="text"
              value={formData.assignedBatch}
              onChange={e => setFormData({ ...formData, assignedBatch: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Optional"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? 'Update Coordinator' : 'Add Coordinator'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coordinator ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coordinators.map(coordinator => (
              <tr key={coordinator.id}>
                <td className="px-6 py-4 whitespace-nowrap">{coordinator.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coordinator.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coordinator.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coordinator.assignedBatch || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditingId(coordinator.id);
                      setFormData(coordinator);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {coordinators.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No coordinators assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}