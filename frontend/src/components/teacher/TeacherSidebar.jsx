// TeacherSidebar.jsx

import React from 'react';
import { Calendar, Clock, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
  { path: '/teacher/routine', icon: Calendar, label: 'View Routine' },
  { path: '/teacher/preferences', icon: Clock, label: 'Set Time Preferences' },
];

export default function TeacherSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear tokens)
    console.log('Logging out...');
    navigate('/'); // Navigate to the sign-in page
  };

  return (
    <div className="w-64 bg-gray-800 h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 text-white mb-8">
        <Calendar className="h-6 w-6" />
        <span className="text-xl font-bold">Teacher Panel</span>
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="pt-4 mt-auto border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}