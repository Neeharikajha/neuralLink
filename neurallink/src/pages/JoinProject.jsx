// src/pages/JoinProject.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import FilterBar from "../components/join/FilterBar";
import ProjectGrid from "../components/join/ProjectGrid";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function JoinProject() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [stack, setStack] = useState("All");
  const [sortKey, setSortKey] = useState("createdAt"); // createdAt | title | owner
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(response.data.projects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const allStacks = useMemo(() => {
    const s = new Set();
    projects.forEach((p) => p.techStack.forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // filter by query
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.owner.email.toLowerCase().includes(q) ||
          p.techStack.join(" ").toLowerCase().includes(q)
      );
    }

    // filter by stack
    if (stack !== "All") {
      list = list.filter((p) => p.techStack.includes(stack));
    }

    // sort
    list.sort((a, b) => {
      if (sortKey === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortKey === "owner") {
        return a.owner.email.localeCompare(b.owner.email);
      }
      return 0;
    });

    return list;
  }, [projects, query, stack, sortKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <FilterBar
          query={query}
          onQuery={setQuery}
          stack={stack}
          onStack={setStack}
          stacks={allStacks}
          sortKey={sortKey}
          onSortKey={setSortKey}
        />

        <ProjectGrid projects={filteredProjects} />
      </div>
    </div>
  );
}
