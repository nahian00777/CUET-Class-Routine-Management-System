import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CoordinatorSidebar from '../../components/coordinator/CoordinatorSidebar';
import GenerateRoutine from '../../components/coordinator/GenerateRoutine';
import UpdateRoutine from '../../components/coordinator/UpdateRoutine';
import ViewRoutine from '../../components/coordinator/ViewRoutine';

export default function CoordinatorPage() {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <CoordinatorSidebar />
        <main className="flex-1 p-6">
          <Routes>
            {/* Redirect from '/coordinator' to '/coordinator/generate' */}
            <Route index element={<Navigate to="generate" />} />
            <Route path="generate" element={<GenerateRoutine />} />
            <Route path="update" element={<UpdateRoutine />} />
            <Route path="view" element={<ViewRoutine />} />
          </Routes>
        </main>
      </div>
    );
  }