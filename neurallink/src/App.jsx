
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/common-components/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import FindTeammates from "./pages/FindTeammates";
import JoinProject from "./pages/JoinProject";
import Chat from "./pages/Chat";

function DashboardLayout() {
  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-72 overflow-auto bg-[#0b1020] text-gray-200">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing without sidebar */}
        <Route path="/" element={<Landing />} />

        {/* Sidebar layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} /> {/* /dashboard */}
          <Route path="find" element={<FindTeammates />} /> {/* /dashboard/find */}
          <Route path="join-project" element={<JoinProject />} /> {/* /dashboard/join-project */}
          <Route path="chat" element={<Chat />} /> {/* /dashboard/chat */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
