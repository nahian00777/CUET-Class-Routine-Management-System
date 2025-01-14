import React from 'react';
import { Layout, Users, BookOpen, UserCheck, Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/admin/teachers', icon: Users, label: 'Manage Teachers' },
  { path: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
  { path: '/admin/coordinators', icon: UserCheck, label: 'Assign Coordinators' },
  { path: '/admin/routine', icon: Calendar, label: 'View Routine' },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="flex items-center gap-2 text-white mb-8">
        <Layout className="h-6 w-6" />
        <span className="text-xl font-bold">Admin Panel</span>
      </div>
      <nav>
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
    </div>
  );
}