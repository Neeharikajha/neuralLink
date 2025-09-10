// src/pages/JoinProject.jsx
import React, { useMemo, useState } from "react";
import FilterBar from "../components/join/FilterBar";
import ProjectGrid from "../components/join/ProjectGrid";

// demo dataset – replace with API data later
const SEED_PROJECTS = [
  {
    id: "nl-collab",
    title: "NeuralLink Collab Hub",
    description: "Real‑time teammate matching, profiles, and AI suggestions.",
    tech: ["Next.js", "Tailwind", "Node", "Postgres"],
    owner: "Ari",
    stars: 128,
    issues: 12,
    // scores out of 100
    userScore: 92,
    compatibility: 88,
    updatedAt: "2025-09-07",
  },
  {
    id: "finops-kit",
    title: "FinOps Dashboard",
    description: "Multi-cloud cost analytics with anomaly alerts.",
    tech: ["React", "Express", "MongoDB"],
    owner: "Tejas",
    stars: 310,
    issues: 5,
    userScore: 84,
    compatibility: 76,
    updatedAt: "2025-09-05",
  },
  {
    id: "ai-prompter",
    title: "AI Prompter + Vector DB",
    description: "Prompt library and embeddings search with LangChain.",
    tech: ["Python", "FastAPI", "Postgres", "LangChain"],
    owner: "Landon",
    stars: 72,
    issues: 9,
    userScore: 79,
    compatibility: 81,
    updatedAt: "2025-09-04",
  },
  {
    id: "devtools-trace",
    title: "DevTools Trace Viewer",
    description: "Web performance trace visualizer and CI comments.",
    tech: ["Next.js", "Tailwind", "Rust", "WASM"],
    owner: "Kai",
    stars: 205,
    issues: 22,
    userScore: 68,
    compatibility: 73,
    updatedAt: "2025-09-03",
  },
];

export default function JoinProject() {
  const [query, setQuery] = useState("");
  const [stack, setStack] = useState("All");
  const [sortKey, setSortKey] = useState("userScore"); // userScore | compatibility | stars | updated

  const allStacks = useMemo(() => {
    const s = new Set();
    SEED_PROJECTS.forEach((p) => p.tech.forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, []);

  const projects = useMemo(() => {
    let list = [...SEED_PROJECTS];

    // filter by query
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.owner.toLowerCase().includes(q) ||
          p.tech.join(" ").toLowerCase().includes(q)
      );
    }

    // filter by stack
    if (stack !== "All") {
      list = list.filter((p) => p.tech.includes(stack));
    }

    // sort
    list.sort((a, b) => {
      if (sortKey === "updated") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return (b[sortKey] ?? 0) - (a[sortKey] ?? 0);
    });

    return list;
  }, [query, stack, sortKey]);

  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-100">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
              Join a project
            </span>
          </h1>
          <p className="text-gray-400 mt-1">
            Browse projects, filter by stack, and request to join the ones that fit best.
          </p>
        </header>

        <FilterBar
          query={query}
          onQuery={setQuery}
          stack={stack}
          onStack={setStack}
          stacks={allStacks}
          sortKey={sortKey}
          onSortKey={setSortKey}
        />

        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
