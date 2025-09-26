import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile() {
  const { user, githubProfile } = useAuth();
  const [userScore, setUserScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/scoring/user-score`);
      setUserScore(response.data.score);
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!githubProfile) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No GitHub Profile Found</h2>
          <p className="text-gray-400">Please connect your GitHub account to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <img 
              src={githubProfile.avatar} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-2 border-purple-500/50"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {githubProfile.displayName || githubProfile.username}
              </h1>
              <p className="text-xl text-gray-400">@{githubProfile.username}</p>
              {githubProfile.bio && (
                <p className="text-gray-300 mt-2 max-w-2xl">{githubProfile.bio}</p>
              )}
              {githubProfile.location && (
                <p className="text-gray-400 mt-1">📍 {githubProfile.location}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Public Repositories"
            value={githubProfile.publicRepos || 0}
            icon="📁"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Followers"
            value={githubProfile.followers || 0}
            icon="👥"
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Following"
            value={githubProfile.following || 0}
            icon="👤"
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="User Score"
            value={userScore?.totalScore || 0}
            icon="⭐"
            color="from-yellow-500 to-orange-500"
            suffix="/100"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repositories */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>📚</span>
                Recent Repositories
              </h2>
              <div className="space-y-4">
                {githubProfile.repos?.slice(0, 8).map((repo, index) => (
                  <RepoCard key={index} repo={repo} />
                ))}
                {(!githubProfile.repos || githubProfile.repos.length === 0) && (
                  <p className="text-gray-400 text-center py-8">No repositories found</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            {userScore && (
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Score Breakdown
                </h3>
                <div className="space-y-3">
                  <ScoreItem
                    label="Activity Score"
                    value={userScore.activityScore || 0}
                    max={100}
                  />
                  <ScoreItem
                    label="Repository Score"
                    value={userScore.repositoryScore || 0}
                    max={40}
                  />
                  <ScoreItem
                    label="Social Score"
                    value={userScore.socialScore || 0}
                    max={30}
                  />
                  <ScoreItem
                    label="Quality Score"
                    value={userScore.qualityScore || 0}
                    max={30}
                  />
                </div>
              </div>
            )}

            {/* GitHub Stats */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📈</span>
                GitHub Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Public Gists</span>
                  <span className="text-white">{githubProfile.publicGists || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Created</span>
                  <span className="text-white">
                    {githubProfile.createdAt ? new Date(githubProfile.createdAt).getFullYear() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Sync</span>
                  <span className="text-white">
                    {githubProfile.lastSync ? new Date(githubProfile.lastSync).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🔗</span>
                Links
              </h3>
              <div className="space-y-3">
                <a
                  href={githubProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition"
                >
                  <span>🐙</span>
                  <span>GitHub Profile</span>
                </a>
                {githubProfile.email && (
                  <a
                    href={`mailto:${githubProfile.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition"
                  >
                    <span>📧</span>
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, suffix = "" }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}{suffix}
        </span>
      </div>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white">{repo.name}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          {repo.language && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
              {repo.language}
            </span>
          )}
          <span>⭐ {repo.stars || 0}</span>
          <span>🍴 {repo.forks || 0}</span>
        </div>
      </div>
      {repo.description && (
        <p className="text-sm text-gray-300 mb-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}

function ScoreItem({ label, value, max }) {
  const percentage = (value / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
