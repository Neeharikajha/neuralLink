// src/components/dashboard/ContributionHeatmap.jsx
import React, { useMemo } from "react";

// color scale (0..max) → className
const DEFAULT_COLORS = [
  "bg-white/5",                               // 0
  "bg-purple-800/50",                        // 1
  "bg-fuchsia-700/60",                       // 2
  "bg-pink-600/70",                          // 3
  "bg-orange-500/80",                        // 4+
];

function getColorIdx(value, maxBucket = 4) {
  if (!value || value <= 0) return 0;
  if (value >= maxBucket) return DEFAULT_COLORS.length - 1;
  return Math.min(DEFAULT_COLORS.length - 1, value);
}

function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun
  const diff = (day + 6) % 7; // make Monday=0
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtISO(d) {
  return d.toISOString().slice(0, 10);
}

export default function ContributionHeatmap({
  data = {},              // { '2025-09-10': 3, ... }
  weeksToShow = 26,
  title = "GitHub Activity",
  subtitle = "Past contributions",
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0,0,0,0);
    return t;
  }, []);

  const grid = useMemo(() => {
    // Build 7 x weeksToShow cells (Mon..Sun)
    const lastMonday = startOfWeek(today);
    const firstDay = addDays(lastMonday, -(weeksToShow - 1) * 7);

    const weeks = [];
    for (let w = 0; w < weeksToShow; w++) {
      const weekStart = addDays(firstDay, w * 7);
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(weekStart, d);
        const key = fmtISO(date);
        const val = data[key] || 0;
        days.push({ date, key, val });
      }
      weeks.push(days);
    }
    return { weeks, firstDay, lastMonday };
  }, [data, today, weeksToShow]);

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <Legend />
      </div>

      <div className="flex gap-2">
        {/* Weekday labels */}
        <div className="flex flex-col justify-between py-1 text-[11px] text-gray-400">
          <span className="h-3">Mon</span>
          <span className="h-3"></span>
          <span className="h-3">Wed</span>
          <span className="h-3"></span>
          <span className="h-3">Fri</span>
          <span className="h-3"></span>
          <span className="h-3">Sun</span>
        </div>

        {/* Grid */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {grid.weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map(({ key, val, date }) => (
                <div
                  key={key}
                  className={[
                    "h-3.5 w-3.5 rounded-[3px] border border-white/10",
                    DEFAULT_COLORS[getColorIdx(val)],
                    // dim future days
                    date > today ? "opacity-30" : ""
                  ].join(" ")}
                  title={`${key}: ${val} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Legend() {
  return (
    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
      Less
      <div className="h-3.5 w-3.5 rounded-[3px] bg-white/5 border border-white/10" />
      <div className="h-3.5 w-3.5 rounded-[3px] bg-purple-800/50 border border-white/10" />
      <div className="h-3.5 w-3.5 rounded-[3px] bg-fuchsia-700/60 border border-white/10" />
      <div className="h-3.5 w-3.5 rounded-[3px] bg-pink-600/70 border border-white/10" />
      <div className="h-3.5 w-3.5 rounded-[3px] bg-orange-500/80 border border-white/10" />
      More
    </div>
  );
}
