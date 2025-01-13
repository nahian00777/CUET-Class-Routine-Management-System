import React, { useState } from "react";
import myImage from "../assets/images/LOGOBRIGHT.jpg";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Swords,
  Trophy,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  LogOut,
} from "lucide-react";

const NavItem = ({ icon, text, collapsed, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center ${
      collapsed ? "justify-center" : "gap-4"
    } px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-200 group relative ${
      isActive ? "bg-gray-800" : ""
    }`}
  >
    <div className="flex items-center justify-center">{icon}</div>
    {!collapsed && <span>{text}</span>}
    {collapsed && (
      <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {text}
      </div>
    )}
  </button>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard"); // Set the initial active item
  const navigate = useNavigate();

  const handleNavigation = (path, item) => {
    setActiveItem(item); // Update active item when navigating
    navigate(path); // Navigate to the page
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out");
    navigate("/"); // Redirect to the login page
  };

  return (
    <div
      className={`h-full bg-gray-900 border-r border-gray-700 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div className="flex items-center">
              {/* <img
                src= {myImage}
                alt="CodeJatra Icon"
                className="w-6 h-6 mr-3"
              /> */}
              <h6 className="text-xl font-bold text-white">CodeJatra</h6>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-white"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="relative mb-4">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={collapsed ? "" : "Search users..."}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-blue-500 ${
              collapsed ? "hidden" : "block"
            }`}
          />
        </div>

        <nav className="flex-1 space-y-2">
          {/* <NavItem
            icon={<Home size={20} />}
            text="Dashboard"
            collapsed={collapsed}
            onClick={() => handleNavigation("/user/dashboard", "dashboard")}
            isActive={activeItem === "dashboard"}
          /> */}
          <NavItem
            icon={<Swords size={20} />}
            text="DUEL"
            collapsed={collapsed}
            onClick={() => handleNavigation("/user/duel", "duel")}
            isActive={activeItem === "duel"}
          />
          <NavItem
            icon={<Trophy size={20} />}
            text="Leaderboard"
            collapsed={collapsed}
            onClick={() => handleNavigation("/user/leaderboard", "leaderboard")}
            isActive={activeItem === "leaderboard"}
          />
          <NavItem
            icon={<Info size={20} />}
            text="IUPC Details"
            collapsed={collapsed}
            onClick={() =>
              handleNavigation("/user/iupc-details", "iupc-details")
            }
            isActive={activeItem === "iupc-details"}
          />
          {/* <NavItem
            icon={<Calendar size={20} />}
            text="Contest Details"
            collapsed={collapsed}
            onClick={() =>
              handleNavigation("/user/contest-details", "contest-details")
            }
            isActive={activeItem === "contest-details"}
          /> */}
        </nav>

        <div className="mt-auto">
          <NavItem
            icon={<LogOut size={20} />}
            text="Logout"
            collapsed={collapsed}
            onClick={handleLogout}
            isActive={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
