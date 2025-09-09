import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/common-components/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import FindTeammates from "./pages/FindTeammates";
import JoinProject from "./pages/JoinProject";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page without Sidebar */}
        <Route path="/" element={<Landing />} />

        {/* Pages WITH Sidebar */}
        <Route
          path="/dashboard/*"
          element={
            <div className="flex w-screen h-screen">
              <Sidebar />
              <div className="flex-1 ml-0 lg:ml-72 overflow-auto bg-white">
                <Routes>
                  <Route path="" element={<Dashboard />} />
                  <Route path="find" element={<FindTeammates />} />
                  <Route path="join-project" element={<JoinProject />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
