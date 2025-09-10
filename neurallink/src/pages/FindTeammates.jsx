// src/pages/Find.jsx
import React, { useMemo, useState } from "react";
import IdeaModal from "../components/find/IdeaModal";
import IdeaCard from "../components/find/IdeaCard";

// demo seed candidates (could be fetched)
const SEED_CANDIDATES = [
  {
    id: "ari-01",
    name: "Ari",
    note: "FinOps dashboard in Next.js",
    score: 92,
    github: "https://github.com/example/ari",
    profile: "/profile/ari-01",
    skills: ["Next.js", "Tailwind", "Node"],
    timezones: ["IST"],
  },
  {
    id: "tejas-02",
    name: "Tejas",
    note: "Open to devtools collab",
    score: 87,
    github: "https://github.com/example/tejas",
    profile: "/profile/tejas-02",
    skills: ["React", "Express", "MongoDB"],
    timezones: ["IST"],
  },
  {
    id: "landon-03",
    name: "Landon",
    note: "AI prompts + vector DB",
    score: 81,
    github: "https://github.com/example/landon",
    profile: "/profile/landon-03",
    skills: ["Python", "Postgres", "LangChain"],
    timezones: ["PST"],
  },
];

export default function Find() {
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState([]);

  const candidates = useMemo(() => SEED_CANDIDATES, []);

  function handleSubmitIdea(payload) {
    const id = crypto.randomUUID?.() || `idea-${Date.now()}`;
    setIdeas((prev) => [
      {
        id,
        ...payload, // {title, description, techstack, requirements}
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-100">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
              Find teammates
            </span>
          </h1>
          <p className="text-gray-400 mt-1">
            Post an idea and collaborate with matched builders.
          </p>
        </header>

        {/* CTA */}
        <div className="mb-6">
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-3 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-fuchsia-500 to-orange-400
                       hover:from-fuchsia-400 hover:to-orange-300
                       border border-white/10 backdrop-blur-md transition"
          >
            Post your idea
          </button>
        </div>

        {/* Posted ideas as cards */}
        <div className="space-y-6">
          {ideas.length === 0 && (
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
              <p className="text-gray-400">
                No ideas yet. Use “Post your idea” to get started.
              </p>
            </div>
          )}

          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              allCandidates={candidates}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <IdeaModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmitIdea}
      />
    </div>
  );
}
