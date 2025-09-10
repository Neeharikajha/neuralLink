// src/components/dashboard/CardShell.jsx
import React from "react";

export default function CardShell({ title, subtitle, right, children }) {
  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
