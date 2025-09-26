// // src/pages/Find.jsx
// import React, { useMemo, useState } from "react";
// import IdeaModal from "../components/find/IdeaModal";
// import IdeaCard from "../components/find/IdeaCard";

// // demo seed candidates (could be fetched)
// const SEED_CANDIDATES = [
//   {
//     id: "ari-01",
//     name: "Ari",
//     note: "FinOps dashboard in Next.js",
//     score: 92,
//     github: "https://github.com/example/ari",
//     profile: "/profile/ari-01",
//     skills: ["Next.js", "Tailwind", "Node"],
//     timezones: ["IST"],
//   },
//   {
//     id: "tejas-02",
//     name: "Tejas",
//     note: "Open to devtools collab",
//     score: 87,
//     github: "https://github.com/example/tejas",
//     profile: "/profile/tejas-02",
//     skills: ["React", "Express", "MongoDB"],
//     timezones: ["IST"],
//   },
//   {
//     id: "landon-03",
//     name: "Landon",
//     note: "AI prompts + vector DB",
//     score: 81,
//     github: "https://github.com/example/landon",
//     profile: "/profile/landon-03",
//     skills: ["Python", "Postgres", "LangChain"],
//     timezones: ["PST"],
//   },
// ];

// export default function Find() {
//   const [open, setOpen] = useState(false);
//   const [ideas, setIdeas] = useState([]);

//   const candidates = useMemo(() => SEED_CANDIDATES, []);

//   function handleSubmitIdea(payload) {
//     const id = crypto.randomUUID?.() || `idea-${Date.now()}`;
//     setIdeas((prev) => [
//       {
//         id,
//         ...payload, // {title, description, techstack, requirements}
//         createdAt: new Date().toISOString(),
//       },
//       ...prev,
//     ]);
//     setOpen(false);
//   }

//   return (
//     <div className="min-h-screen bg-[#0b1020] text-gray-200">
//       <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
//         <header className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-100">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
//               Find teammates
//             </span>
//           </h1>
//           <p className="text-gray-400 mt-1">
//             Post an idea and collaborate with matched builders.
//           </p>
//         </header>

//         {/* CTA */}
//         <div className="mb-6">
//           <button
//             onClick={() => setOpen(true)}
//             className="px-5 py-3 rounded-lg font-semibold text-white
//                        bg-gradient-to-r from-fuchsia-500 to-orange-400
//                        hover:from-fuchsia-400 hover:to-orange-300
//                        border border-white/10 backdrop-blur-md transition"
//           >
//             Post your idea
//           </button>
//         </div>

//         {/* Posted ideas as cards */}
//         <div className="space-y-6">
//           {ideas.length === 0 && (
//             <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
//               <p className="text-gray-400">
//                 No ideas yet. Use “Post your idea” to get started.
//               </p>
//             </div>
//           )}

//           {ideas.map((idea) => (
//             <IdeaCard
//               key={idea.id}
//               idea={idea}
//               allCandidates={candidates}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       <IdeaModal
//         open={open}
//         onClose={() => setOpen(false)}
//         onSubmit={handleSubmitIdea}
//       />
//     </div>
//   );
// }



// src/pages/FindTeammates.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import ProjectModal from "../components/find/ProjectModal";
import ProjectCard from "../components/find/ProjectCard";
import JoinRequestCard from "../components/find/JoinRequestCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function FindTeammates() {
  const { user, githubProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'requests'

  // fetch projects on mount
  useEffect(() => {
    fetchProjects();
    fetchJoinRequests();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(response.data.projects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/join-requests`);
      setJoinRequests(response.data.joinRequests);
    } catch (err) {
      console.error("Failed to fetch join requests:", err);
    }
  };

  // submit new project
  async function handleSubmitProject(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/projects`, payload);
      setProjects((prev) => [response.data.project, ...prev]);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project");
    }
  }

  const handleJoinRequest = async (requestId, action, rejectionReason = "") => {
    try {
      await axios.put(`${API_BASE_URL}/api/join-requests/${requestId}`, {
        action,
        rejectionReason
      });
      
      // Refresh the list
      await fetchJoinRequests();
      alert(`Join request ${action}d successfully!`);
    } catch (error) {
      console.error(`Failed to ${action} join request:`, error);
      alert(`Failed to ${action} join request`);
    }
  };

  // Filter join requests for projects owned by current user
  const myProjectRequests = joinRequests.filter(request => 
    request.project.owner._id === user?.id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-100">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
              Find teammates
            </span>
          </h1>
          <p className="text-gray-400 mt-1">
            Post a project and collaborate with matched builders.
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'projects'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'requests'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Join Requests ({myProjectRequests.length})
          </button>
        </div>

        {/* CTA for projects tab */}
        {activeTab === 'projects' && (
          <div className="mb-6">
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-3 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-fuchsia-500 to-orange-400
                         hover:from-fuchsia-400 hover:to-orange-300
                         border border-white/10 backdrop-blur-md transition"
            >
              Post your project
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'projects' ? (
          <div className="space-y-6">
            {projects.length === 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
                <p className="text-gray-400">
                  No projects yet. Use "Post your project" to get started.
                </p>
              </div>
            )}

            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {myProjectRequests.length === 0 ? (
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
                <p className="text-gray-400">
                  No join requests for your projects yet.
                </p>
              </div>
            ) : (
              myProjectRequests.map((request) => (
                <JoinRequestCard
                  key={request._id}
                  request={request}
                  onApprove={(id) => handleJoinRequest(id, 'approve')}
                  onReject={(id, reason) => handleJoinRequest(id, 'reject', reason)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
}
