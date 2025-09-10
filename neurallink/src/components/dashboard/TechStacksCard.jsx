// src/components/dashboard/TechStacksCard.jsx
import React from "react";
import CardShell from "./CardShell";

const badgeClass =
  "px-2 py-0.5 rounded-md text-xs bg-white/10 border border-white/10 text-gray-300";

export default function TechStacksCard({ stacks = [] }) {
  return (
    <CardShell title="Tech stacks" subtitle="Primary tools & proficiency">
      <ul className="divide-y divide-white/10">
        {stacks.map((s) => (
          <li key={s.name} className="py-3 flex items-center justify-between">
            <span className="font-medium">{s.name}</span>
            <span className={badgeClass}>{s.level}</span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
