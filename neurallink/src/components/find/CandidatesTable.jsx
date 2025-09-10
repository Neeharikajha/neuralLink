// src/components/find/CandidatesTable.jsx
import React, { useMemo, useState } from "react";

export default function CandidatesTable({ rows = [], compact = false }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...rows].sort((a, b) => b.score - a.score);
    if (!q) return sorted;
    return sorted.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.note?.toLowerCase().includes(q) ||
        r.skills?.join(" ").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const cellPad = compact ? "px-3 py-2" : "px-3 py-3";
  const titleSize = compact ? "text-base" : "text-lg";

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5">
      <div className={`flex items-center justify-between mb-4`}>
        <div>
          <h2 className={`${titleSize} font-semibold`}>Collaborators</h2>
          <p className="text-sm text-gray-400">
            Sorted by score; click a user to view GitHub or profile.
          </p>
        </div>
        {!compact && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, skill, note…"
            className="w-64 max-w-[60vw] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
          />
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-left text-gray-300">
              <th className={cellPad + " font-medium"}>User</th>
              <th className={cellPad + " font-medium"}>Note</th>
              <th className={cellPad + " font-medium"}>Skills</th>
              <th className={cellPad + " font-medium"}>Score</th>
              <th className={cellPad + " font-medium"}>Links</th>
              <th className={cellPad + " font-medium"}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-white/5">
                <td className={cellPad}>
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] border border-white/10 tracking-wide">
                      {u.name ? u.name[0].toUpperCase() : "U"}
                    </span>
                    <a
                      href={u.profile || u.github}
                      className="text-gray-200 hover:text-pink-300"
                    >
                      {u.name}
                    </a>
                  </div>
                </td>

                <td className={cellPad + " text-gray-300"}>
                  {u.note || "-"}
                </td>

                <td className={cellPad}>
                  <div className="flex flex-wrap gap-1.5">
                    {(u.skills || []).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md text-xs bg-white/10 border border-white/10 text-gray-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>

                <td className={cellPad}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-300 font-semibold">
                    {u.score}
                  </span>
                </td>

                <td className={cellPad}>
                  <div className="flex items-center gap-3">
                    {u.github && (
                      <a
                        href={u.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-300 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                    {u.profile && (
                      <a
                        href={u.profile}
                        className="text-purple-300 hover:underline"
                      >
                        neuralLink
                      </a>
                    )}
                  </div>
                </td>

                <td className={cellPad}>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-md text-white bg-gradient-to-r from-fuchsia-500 to-orange-400 hover:from-fuchsia-400 hover:to-orange-300">
                      Accept
                    </button>
                    <button className="px-3 py-1.5 rounded-md border border-white/10 text-gray-300 hover:bg-white/5">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className={cellPad + " text-gray-400"} colSpan={6}>
                  No matching collaborators yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
