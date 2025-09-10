// src/components/dashboard/GithubStreakCard.jsx
import React from "react";
import CardShell from "./CardShell";

function GradientProgress({ value }) {
  return (
    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 transition-all duration-700"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export default function GithubStreakCard({
  streakDays = 0,
  currentWeekPct = 0,
  monthlyTargetPct = 0,
}) {
  return (
    <CardShell
      title="GitHub Activity"
      subtitle="Commit streak and targets"
      right={
        <div className="px-3 py-1 rounded-md text-xs bg-white/10 border border-white/10">
          Streak: <span className="text-pink-300 font-semibold">{streakDays}d</span>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">This week</span>
            <span className="text-sm text-gray-300">{currentWeekPct}%</span>
          </div>
          <GradientProgress value={currentWeekPct} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Monthly target</span>
            <span className="text-sm text-gray-300">{monthlyTargetPct}%</span>
          </div>
          <GradientProgress value={monthlyTargetPct} />
        </div>

        <div className="text-xs text-gray-400">
          Tip: keep commits small and frequent to extend the streak. 
        </div>
      </div>
    </CardShell>
  );
}
