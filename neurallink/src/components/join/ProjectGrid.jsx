// src/components/join/ProjectGrid.jsx
import React from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ projects = [] }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 text-gray-400">
        No projects match the current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
