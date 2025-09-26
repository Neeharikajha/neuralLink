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
      className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-3">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Owner: {owner.email}</span>
            <span>Contributors: {currentContributors.length}</span>
            <span>Status: {status}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-gray-400">
            {new Date(createdAt).toLocaleDateString()}
          </span>
          
          {!isOwner && !isContributor && (
            <button
              onClick={handleRequestToJoin}
              disabled={requesting}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
            >
              {requesting ? "Requesting..." : "Request to Join"}
            </button>
          )}
          
          {isOwner && (
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              Your Project
            </span>
          )}
          
          {isContributor && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              Contributor
            </span>
          )}
        </div>
      </div>

      {project.requirements && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-1">Requirements:</h4>
          <p className="text-sm text-gray-400">{project.requirements}</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
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
