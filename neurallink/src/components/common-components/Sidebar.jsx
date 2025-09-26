// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiHome, FiUsers, FiMessageCircle, FiFolderPlus,
//   FiMenu, FiX, FiUser, FiLogOut
// } from "react-icons/fi";

// const MAIN_MENU = [
//   { label: "Dashboard", icon: FiHome, path: "/dashboard" },
//   { label: "Find Teammates", icon: FiUsers, path: "/find" },
//   { label: "Join Project", icon: FiFolderPlus, path: "/join-project" },
//   { label: "Chat", icon: FiMessageCircle, path: "/chat" },
// ];

// export default function Sidebar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const location = useLocation();

//   return (
//     <>
//       <button
//         className="lg:hidden fixed top-4 left-4 z-50 bg-white/10 text-gray-200 border border-white/10 p-2 rounded-md backdrop-blur-md"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
//       </button>

//       <aside
//         className={`w-72 h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300
//         ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
//         bg-white/5 backdrop-blur-md border-r border-white/10 text-gray-200 flex flex-col`}
//       >
//         {/* divider edge only (no shadow) */}
//         <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-white/10" />

//         <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
//           <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-black/90 rounded-full h-10 w-10 flex items-center justify-center font-extrabold">
//             nL
//           </div>
//           <div>
//             <div className="font-semibold tracking-wide">neuralLink</div>
//             <div className="text-xs text-gray-400">Collab Platform</div>
//           </div>
//         </div>

//         <nav className="flex-1 px-2 py-4 overflow-y-auto">
//           {MAIN_MENU.map((item) => {
//             const isActive = location.pathname === item.path || location.pathname === `/dashboard${item.path === "/dashboard" ? "" : item.path}`;
//             return (
//               <Link
//                 key={item.label}
//                 to={item.path === "/dashboard" ? "/dashboard" : `/dashboard${item.path}`}
//                 className={[
//                   "group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
//                   "text-gray-300 hover:text-white",
//                   "hover:bg-white/5",
//                   isActive ? "bg-white/10 text-white" : "",
//                 ].join(" ")}
//                 onClick={() => setMenuOpen(false)}
//               >
//                 <item.icon className={isActive ? "h-4 w-4 text-pink-300" : "h-4 w-4 text-gray-400 group-hover:text-pink-200"} />
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Profile dropdown at bottom */}
//         <div className="relative border-t border-white/10">
//           <button
//             className="flex items-center gap-2 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5"
//             onClick={() => setProfileOpen(!profileOpen)}
//           >
//             <FiUser className="h-4 w-4" />
//             <span>Profile</span>
//           </button>

//           {profileOpen && (
//             <div className="absolute bottom-14 left-0 w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
//               <Link
//                 to="/profile"
//                 className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
//                 onClick={() => {
//                   setProfileOpen(false);
//                   setMenuOpen(false);
//                 }}
//               >
//                 <FiUser className="h-4 w-4" />
//                 Profile
//               </Link>
//               <button
//                 className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/5 w-full text-left"
//                 onClick={() => {
//                   // add logout logic here
//                   console.log("Logout clicked");
//                   setProfileOpen(false);
//                 }}
//               >
//                 <FiLogOut className="h-4 w-4" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }



import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiHome, FiUsers, FiMessageCircle, FiFolderPlus, FiSettings,
  FiMenu, FiX, FiUser, FiLogOut
} from "react-icons/fi";

const MAIN_MENU = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },
  { label: "Find Teammates", icon: FiUsers, path: "/find" },
  { label: "Join Project", icon: FiFolderPlus, path: "/join-project" },
  { label: "Chat", icon: FiMessageCircle, path: "/chat" },
  { label: "Admin", icon: FiSettings, path: "/admin" },
];

export default function Sidebar() {
  const { user, githubProfile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/10 text-gray-200 border border-white/10 p-2 rounded-md backdrop-blur-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-72 h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        bg-white/5 backdrop-blur-md border-r border-white/10 text-gray-200 flex flex-col`}
      >
        {/* Divider edge only */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-white/10" />

        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-black/90 rounded-full h-10 w-10 flex items-center justify-center font-extrabold">
            nL
          </div>
          <div>
            <div className="font-semibold tracking-wide">neuralLink</div>
            <div className="text-xs text-gray-400">Collab Platform</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {MAIN_MENU.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname ===
                `/dashboard${item.path === "/dashboard" ? "" : item.path}`;
            return (
              <Link
                key={item.label}
                to={
                  item.path === "/dashboard"
                    ? "/dashboard"
                    : `/dashboard${item.path}`
                }
                className={[
                  "group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "text-gray-300 hover:text-white",
                  "hover:bg-white/5",
                  isActive ? "bg-white/10 text-white" : "",
                ].join(" ")}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon
                  className={
                    isActive
                      ? "h-4 w-4 text-pink-300"
                      : "h-4 w-4 text-gray-400 group-hover:text-pink-200"
                  }
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="px-3 mb-6 relative">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {githubProfile?.avatar ? (
              <img 
                src={githubProfile.avatar} 
                alt="Profile" 
                className="rounded-full h-8 w-8 object-cover"
              />
            ) : (
              <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full h-8 w-8 flex items-center justify-center font-bold text-black/90">
                {githubProfile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold">
                {githubProfile?.displayName || githubProfile?.username || user?.email || 'User'}
              </div>
              <div className="text-xs text-gray-400">
                {githubProfile?.username ? `@${githubProfile.username}` : 'View Profile'}
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
