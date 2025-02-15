import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    coordinatorID: "",
    coordinatorName: "",
    department: "",
    assignedBatch: "",
  });

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/coordinators/getCoordinator"
        );
        setCoordinators(response.data.data);
      } catch (error) {
        console.error("Error fetching coordinators:", error);
        toast.error("Error fetching coordinators.");
      }
    };
    fetchCoordinators();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        await axios.patch(
          "http://localhost:3000/api/v1/coordinators/updateCoordinator",
          {
            prevCoordinatorID: editingId,
            coordinatorID: formData.coordinatorID,
            coordinatorName: formData.coordinatorName,
            department: formData.department,
            assignedBatch: formData.assignedBatch,
          }
        );
        setCoordinators(
          coordinators.map((c) =>
            c.coordinatorID === editingId ? formData : c
          )
        );
        setEditingId(null);
        toast.success("Coordinator updated successfully.");
      } catch (error) {
        console.error("Error updating coordinator:", error);
        toast.error("Error updating coordinator.");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/coordinators/addCoordinator",
          {
            coordinatorID: formData.coordinatorID,
            coordinatorName: formData.coordinatorName,
            department: formData.department,
            assignedBatch: formData.assignedBatch,
          }
        );
        setCoordinators([...coordinators, response.data.data]);
        setFormData({
          coordinatorID: "",
          coordinatorName: "",
          department: "",
          assignedBatch: "",
        });
        toast.success("Coordinator added successfully.");
      } catch (error) {
        console.error("Error adding coordinator:", error);
        toast.error("Error adding coordinator.");
      }
    }
  };

  const handleEdit = (coordinator) => {
    setEditingId(coordinator.coordinatorID);
    setFormData({
      coordinatorID: coordinator.coordinatorID,
      coordinatorName: coordinator.coordinatorName,
      department: coordinator.department,
      assignedBatch: coordinator.assignedBatch,
    });
  };

  const handleDelete = async (coordinatorID) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/coordinators/deleteCoordinator`,
        {
          data: { coordinatorID },
        }
      );
      setCoordinators(
        coordinators.filter(
          (coordinator) => coordinator.coordinatorID !== coordinatorID
        )
      );
      toast.success("Coordinator deleted successfully.");
    } catch (error) {
      console.error("Error deleting coordinator:", error);
      toast.error("Error deleting coordinator.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Coordinators</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordinator ID
            </label>
            <input
              type="text"
              value={formData.coordinatorID}
              onChange={(e) =>
                setFormData({ ...formData, coordinatorID: e.target.value })
              }
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
              value={formData.coordinatorName}
              onChange={(e) =>
                setFormData({ ...formData, coordinatorName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Batch
            </label>
            <input
              type="text"
              value={formData.assignedBatch}
              onChange={(e) =>
                setFormData({ ...formData, assignedBatch: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {editingId ? "Update Coordinator" : "Add Coordinator"}
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
            {coordinators.map((coordinator) => (
              <tr key={coordinator.coordinatorID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coordinator.coordinatorID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coordinator.coordinatorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coordinator.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coordinator.assignedBatch || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => handleEdit(coordinator)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(coordinator.coordinatorID)}
                    className="pl-4 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
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

      <ToastContainer />
    </div>
  );
}
