// src/components/dashboard/QuickStats.jsx
import React from "react";

export default function QuickStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4"
        >
          <div className="text-sm text-gray-400">{s.label}</div>
          <div className="mt-1 text-2xl font-semibold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-300">
              {s.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
