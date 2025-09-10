// src/components/dashboard/ActiveProjectCard.jsx
import React from "react";
import CardShell from "./CardShell";

function GradientProgress({ value }) {
  return (
    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-400 to-orange-300 transition-all duration-700"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export default function ActiveProjectCard({ name, description, tags = [], progress = 0 }) {
  return (
    <CardShell title="Current Active Project" subtitle="Primary focus right now">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-medium">{name}</h3>
          <p className="text-gray-400 mt-1">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-gray-200"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-300">{progress}%</span>
          </div>
          <GradientProgress value={progress} />
        </div>
      </div>
    </CardShell>
  );
}
