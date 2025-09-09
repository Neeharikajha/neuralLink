import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiMessageCircle, FiFolderPlus, FiLogOut, FiMenu, FiX } from "react-icons/fi";

// Sidebar menu matching your requirements
const MAIN_MENU = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },
  { label: "Find Teammates", icon: FiUsers, path: "/find" },
  { label: "Join Project", icon: FiFolderPlus, path: "/join-project" },
  { label: "Chat", icon: FiMessageCircle, path: "/chat" },
];

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded-md shadow"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r w-72 flex flex-col h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <div className="bg-black text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-xl">
            N
          </div>
          <div>
            <div className="font-semibold">Neurallink</div>
            <div className="text-xs text-gray-400">Collab Platform</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {MAIN_MENU.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-200 font-semibold" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Login/Logout */}
        <div className="p-3 border-t mt-auto">
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm px-2">
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
