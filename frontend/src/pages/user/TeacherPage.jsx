import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherSidebar from '../../components/teacher/TeacherSidebar';
import ViewRoutine from '../../components/teacher/ViewRoutine';
import TimePreferences from '../../components/teacher/TimePreferences';

export default function TeacherPage() {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <Routes>
            {/* Redirect from '/teacher' to '/teacher/routine' */}
            <Route index element={<Navigate to="routine" />} />
            <Route path="routine" element={<ViewRoutine />} />
            <Route path="preferences" element={<TimePreferences />} />
          </Routes>
        </main>
      </div>
    );
  }