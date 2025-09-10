// src/pages/Dashboard.jsx
import React from "react";
import ActiveProjectCard from "../components/dashboard/ActiveProjectCard";
import TechStacksCard from "../components/dashboard/TechStacksCard";
import QuickStats from "../components/dashboard/QuickStats";
import ContributionHeatmap from "../components/dashboard/ContributionHeatmap";

// mock data example (date → count)
// Ideally, fetch from a backend or GitHub API, then pass in
const mockData = (() => {
  const map = {};
  const today = new Date();
  for (let i = 0; i < 180; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    // random-ish contribution counts 0..5
    map[key] = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 5);
  }
  return map;
})();

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      {/* spacing from sidebar */}
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400 mt-1">
            Overview of projects, skills, and GitHub activity.
          </p>
        </header>

        {/* top stats */}
        <QuickStats
          stats={[
            { label: "Active Projects", value: 1 },
            { label: "Open Tasks", value: 7 },
            { label: "This Week Commits", value: 18 },
          ]}
        />

        {/* main grid */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <ActiveProjectCard
              name="NeuralLink Collab Hub"
              description="Real‑time teammate matching, project join flow, and AI‑assisted recommendations."
              tags={["Next.js", "Tailwind", "Node", "Postgres"]}
              progress={62}
            />

            {/* Contribution heatmap replaces old streak card */}
            <ContributionHeatmap
              data={mockData}
              weeksToShow={26}
              title="Activity"
              subtitle="Last 6 months"
            />
          </div>

          <div className="xl:col-span-1">
            <TechStacksCard
              stacks={[
                { name: "Next.js", level: "Advanced" },
                { name: "React", level: "Advanced" },
                { name: "Tailwind CSS", level: "Advanced" },
                { name: "Node.js", level: "Intermediate" },
                { name: "PostgreSQL", level: "Intermediate" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
