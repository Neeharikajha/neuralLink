import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiUsers, FiMessageCircle, FiFolderPlus, FiLogOut, FiMenu, FiX
} from "react-icons/fi";

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
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/10 text-gray-200 border border-white/10 p-2 rounded-md backdrop-blur-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </button>

      <aside
        className={`w-72 h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        bg-white/5 backdrop-blur-md border-r border-white/10 text-gray-200`}
      >
        {/* divider edge only (no shadow) */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-white/10" />

        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-black/90 rounded-full h-10 w-10 flex items-center justify-center font-extrabold">
            nL
          </div>
          <div>
            <div className="font-semibold tracking-wide">neuralLink</div>
            <div className="text-xs text-gray-400">Collab Platform</div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {MAIN_MENU.map((item) => {
            const isActive = location.pathname === item.path || location.pathname === `/dashboard${item.path === "/dashboard" ? "" : item.path}`;
            return (
              <Link
                key={item.label}
                to={item.path === "/dashboard" ? "/dashboard" : `/dashboard${item.path}`}
                className={[
                  "group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "text-gray-300 hover:text-white",
                  "hover:bg-white/5",
                  isActive ? "bg-white/10 text-white" : "",
                ].join(" ")}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className={isActive ? "h-4 w-4 text-pink-300" : "h-4 w-4 text-gray-400 group-hover:text-pink-200"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout pinned last */}
        <div className="mt-auto p-3 border-t border-white/10">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-2">
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
