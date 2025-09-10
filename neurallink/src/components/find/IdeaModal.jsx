// src/components/find/IdeaModal.jsx
import React, { useState } from "react";

export default function IdeaModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techstack: "",
    requirements: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
        <h2 className="text-lg font-semibold mb-1">Post your idea</h2>
        <p className="text-sm text-gray-400 mb-4">
          Share a quick brief so collaborators can evaluate fit.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
              placeholder="e.g., NeuralLink Collab Hub"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
              placeholder="Goal, features, target users…"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Tech stack</label>
            <input
              required
              value={form.techstack}
              onChange={(e) => setForm({ ...form, techstack: e.target.value })}
              className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
              placeholder="Next.js, Tailwind, Node, Postgres"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Additional requirements</label>
            <textarea
              rows={3}
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
              placeholder="Availability, timezone, prior work…"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-orange-400 hover:from-fuchsia-400 hover:to-orange-300"
            >
              Done & Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
