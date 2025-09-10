// src/components/join/FilterBar.jsx
import React from "react";

export default function FilterBar({
  query, onQuery, stack, onStack, stacks = [],
  sortKey, onSortKey
}) {
  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 mb-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-1 gap-3 min-w-0">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search projects, owner, description…"
            className="flex-1 min-w-0 rounded-md bg-[#111527] text-gray-100
                       border border-white/10 px-3 py-2.5 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-pink-400/40"
          />
          <select
            value={stack}
            onChange={(e) => onStack(e.target.value)}
            className="rounded-md bg-[#111527] text-gray-100
                       border border-white/10 px-3 py-2.5 focus:outline-none"
          >
            {stacks.map((s) => (
              <option key={s} value={s} className="bg-[#0b1020] text-gray-100">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Sort:</label>
          <select
            value={sortKey}
            onChange={(e) => onSortKey(e.target.value)}
            className="rounded-md bg-[#111527] text-gray-100
                       border border-white/10 px-3 py-2.5 focus:outline-none"
          >
            <option className="bg-[#0b1020] text-gray-100" value="userScore">My score</option>
            <option className="bg-[#0b1020] text-gray-100" value="compatibility">Compatibility</option>
            <option className="bg-[#0b1020] text-gray-100" value="stars">Stars</option>
            <option className="bg-[#0b1020] text-gray-100" value="updated">Recently updated</option>
          </select>
        </div>
      </div>
    </section>
  );
}
