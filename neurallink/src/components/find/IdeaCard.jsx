// src/components/find/IdeaCard.jsx
import React, { useMemo, useState } from "react";
import CandidatesTable from "./CandidatesTable";

export default function IdeaCard({ idea, allCandidates = [] }) {
  const [expanded, setExpanded] = useState(true);

  // keyword matching on skills/note/title/techstack
  const rows = useMemo(() => {
    const keys = [
      idea.title,
      idea.techstack,
      idea.description,
      idea.requirements,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const match = (u) => {
      const hay =
        [
          u.name,
          u.note,
          ...(u.skills || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase() || "";
      // loose match: at least one overlap word or stack keyword present
      return keys.split(/\W+/).some((k) => k && hay.includes(k));
    };

    const filtered = allCandidates.filter(match);
    // If no match, show top few anyway to avoid blank
    const safe = filtered.length ? filtered : allCandidates.slice(0, 5);
    return safe.sort((a, b) => b.score - a.score);
  }, [idea, allCandidates]);

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">
            {idea.title}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{idea.description}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {idea.techstack && (
              <span className="px-2.5 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-gray-300">
                {idea.techstack}
              </span>
            )}
            {idea.requirements && (
              <span className="px-2.5 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-gray-300">
                {idea.requirements}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-gray-400">
              {new Date(idea.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="px-3 py-1.5 rounded-md border border-white/10 text-gray-300 hover:bg-white/5"
          aria-expanded={expanded}
        >
          {expanded ? "Hide requests" : "View requests"}
        </button>
      </div>

      {expanded && (
        <div className="mt-5">
          <CandidatesTable rows={rows} compact />
        </div>
      )}
    </section>
  );
}
