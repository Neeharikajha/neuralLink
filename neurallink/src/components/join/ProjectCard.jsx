// src/components/join/ProjectCard.jsx
import React from "react";

function ScorePill({ label, value, gradient = "from-fuchsia-400 to-orange-300" }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
        {value}
      </span>
    </div>
  );
}

export default function ProjectCard({ project }) {
  const {
    title, description, tech = [], owner, stars, issues,
    userScore, compatibility, updatedAt
  } = project;

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
          {tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Owner: <span className="text-gray-300">{owner}</span></span>
            <span>⭐ {stars}</span>
            <span>Issues: {issues}</span>
          </div>
          <span>{new Date(updatedAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <ScorePill label="My score" value={userScore} />
          <ScorePill label="Compatibility" value={compatibility} gradient="from-purple-300 to-pink-300" />
        </div>
      </div>

      {/* bottom actions pinned for uniform alignment */}
      <div className="mt-5 flex gap-2">
        <button
          className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-fuchsia-500 to-orange-400
                     hover:from-fuchsia-400 hover:to-orange-300"
        >
          Request to join
        </button>
        <button className="px-4 py-2 rounded-md border border-white/10 text-gray-300 hover:bg-white/5">
          View repo
        </button>
      </div>
    </article>
  );
}
