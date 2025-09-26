// src/components/join/ProjectCard.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProjectCard({ project }) {
  const { user } = useAuth();
  const [requesting, setRequesting] = useState(false);

  const {
    _id, title, description, techStack = [], owner, currentContributors = [],
    status, difficulty, timeCommitment, projectUrl, repositoryUrl, createdAt
  } = project;

  const handleRequestToJoin = async () => {
    if (!user) {
      alert("Please login to request to join projects");
      return;
    }

    try {
      setRequesting(true);
      await axios.post(`${API_BASE_URL}/api/join-requests`, {
        projectId: _id,
        message: `I'm interested in contributing to ${title}`
      });
      alert("Join request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit join request:", error);
      alert("Failed to submit join request");
    } finally {
      setRequesting(false);
    }
  };

  const isOwner = user && owner._id === user.id;
  const isContributor = user && currentContributors.some(contributor => contributor._id === user.id);

  return (
    <article
      className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                 p-5 h-full min-h-[280px] flex flex-col"
    >
      {/* content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Owner: <span className="text-gray-300">{owner.email}</span></span>
            <span>Contributors: {currentContributors.length}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              status === 'active' ? 'bg-green-500/20 text-green-300' :
              status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {status}
            </span>
          </div>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Difficulty: <span className="text-gray-300 capitalize">{difficulty}</span></span>
          <span className="text-gray-400">Time: <span className="text-gray-300 capitalize">{timeCommitment}</span></span>
        </div>
      </div>

      {/* bottom actions pinned for uniform alignment */}
      <div className="mt-5 flex gap-2">
        {!isOwner && !isContributor ? (
          <button
            onClick={handleRequestToJoin}
            disabled={requesting}
            className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-fuchsia-500 to-orange-400
                       hover:from-fuchsia-400 hover:to-orange-300 disabled:opacity-50"
          >
            {requesting ? "Requesting..." : "Request to join"}
          </button>
        ) : isOwner ? (
          <span className="px-4 py-2 rounded-md bg-green-500/20 text-green-300 text-sm">
            Your Project
          </span>
        ) : (
          <span className="px-4 py-2 rounded-md bg-blue-500/20 text-blue-300 text-sm">
            Contributor
          </span>
        )}
        
        {repositoryUrl && (
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border border-white/10 text-gray-300 hover:bg-white/5"
          >
            View repo
          </a>
        )}
        
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border border-white/10 text-gray-300 hover:bg-white/5"
          >
            View project
          </a>
        )}
      </div>
    </article>
  );
}
