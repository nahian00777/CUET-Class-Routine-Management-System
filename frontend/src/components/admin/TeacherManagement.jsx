import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    teacherID: "",
    teacherName: "",
    department: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/teachers/getTeacher`
        );
        setTeachers(response.data.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Error fetching teachers.");
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        await axios.patch(
          `${apiUrl}/api/v1/teachers/updateTeacher`,
          {
            prevTeacherID: editingId,
            teacherID: formData.teacherID,
            teacherName: formData.teacherName,
            department: formData.department,
          }
        );
        setTeachers(
          teachers.map((t) => (t.teacherID === editingId ? formData : t))
        );
        setEditingId(null);
        toast.success("Teacher updated successfully.");
      } catch (error) {
        console.error("Error updating teacher:", error);
        toast.error("Error updating teacher.");
      }
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/teachers/addTeacher`,
          {
            teacherID: formData.teacherID,
            teacherName: formData.teacherName,
            department: formData.department,
          }
        );
        setTeachers([...teachers, response.data.data]);
        setFormData({ teacherID: "", teacherName: "", department: "" });
        toast.success("Teacher added successfully.");
      } catch (error) {
        console.error("Error adding teacher:", error);
        toast.error("Error adding teacher.");
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.teacherID);
    setFormData({
      teacherID: teacher.teacherID,
      teacherName: teacher.teacherName,
      department: teacher.department,
    });
  };

  const handleDelete = async (teacherID) => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/teachers/deleteTeacher`,
        {
          data: { teacherID },
        }
      );
      setTeachers(
        teachers.filter((teacher) => teacher.teacherID !== teacherID)
      );
      toast.success("Teacher deleted successfully.");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Error deleting teacher.");
    }
  };

  // Filter teachers based on the search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Teachers</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher Name
            </label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) =>
                setFormData({ ...formData, teacherName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              placeholder="Teacher Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher ID
            </label>
            <input
              type="text"
              value={formData.teacherID}
              onChange={(e) =>
                setFormData({ ...formData, teacherID: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              placeholder="Teacher ID"
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
          {editingId ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Teacher Name or ID"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teacher ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.teacherID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.teacherID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.teacherName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.teacherID)}
                    className="pl-4 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
}
