import React from 'react';
import { Layout, Users, BookOpen, UserCheck, Calendar, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
  { path: '/admin/teachers', icon: Users, label: 'Manage Teachers' },
  { path: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
  { path: '/admin/coordinators', icon: UserCheck, label: 'Assign Coordinators' },
  { path: '/admin/routine', icon: Calendar, label: 'View Routine' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // For example, clear tokens, session data, etc.
    // Then navigate to the sign-in page
    navigate('/');
  };

  return (
    <div className="w-64 bg-gray-800 h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 text-white mb-8">
        <Layout className="h-6 w-6" />
        <span className="text-xl font-bold">Admin Panel</span>
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
      <div className="pt-4 mt-4 border-t border-gray-700">
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