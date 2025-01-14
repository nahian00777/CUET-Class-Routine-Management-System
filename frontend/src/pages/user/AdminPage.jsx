import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CourseManagement from '../../components/admin/CourseManagement';
import TeacherManagement from '../../components/admin/TeacherManagement';
import CoordinatorManagement from '../../components/admin/CoordinatorManagement';
import ViewRoutine from '../../components/admin/ViewRoutine';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <Routes>
          {/* Redirect from '/admin' to '/admin/teachers' */}
          <Route index element={<Navigate to="teachers" />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="coordinators" element={<CoordinatorManagement />} />
          <Route path="routine" element={<ViewRoutine />} />
        </Routes>
      </main>
    </div>
  );
}