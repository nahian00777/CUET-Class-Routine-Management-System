import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/general/SignIn";
import CoordinatorPage from "./pages/user/CoordinatorPage";
import TeacherPage from "./pages/user/TeacherPage"; // Import TeacherPage
import AdminPage from "./pages/user/AdminPage"; // Import TeacherPage

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/coordinator/*" element={<CoordinatorPage />} />
      <Route path="/teacher/*" element={<TeacherPage />} />
      <Route path="/admin/*" element={<AdminPage />} />  {/* Add TeacherPage route */}
      {/* Other routes */}
    </Routes>
  );
}

export default App;