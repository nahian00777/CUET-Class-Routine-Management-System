import React from 'react';
import { Calendar, PlusCircle, Edit, Eye } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/coordinator/generate', icon: PlusCircle, label: 'Generate Routine' },
  { path: '/coordinator/update', icon: Edit, label: 'Update Routine' },
  { path: '/coordinator/view', icon: Eye, label: 'View Routine' },
];

export default function CoordinatorSidebar() {
  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="flex items-center gap-2 text-white mb-8">
        <Calendar className="h-6 w-6" />
        <span className="text-xl font-bold">Coordinator Panel</span>
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