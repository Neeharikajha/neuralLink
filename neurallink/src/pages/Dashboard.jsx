// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import githubService from "../services/githubService";
import ActiveProjectCard from "../components/dashboard/ActiveProjectCard";
import TechStacksCard from "../components/dashboard/TechStacksCard";
import QuickStats from "../components/dashboard/QuickStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Dashboard() {
  const { githubProfile, syncGitHubData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userScore, setUserScore] = useState(null);
  const [contributionData, setContributionData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load user score
      const scoreResponse = await githubService.getUserScore();
      setUserScore(scoreResponse.score);

      // Load contribution data
      const contributionResponse = await githubService.getContributionData();
      setContributionData(contributionResponse.data || {});

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");

      // Sync GitHub data
      await syncGitHubData();
      
      // Reload dashboard data
      await loadDashboardData();

    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-gray-200 flex items-center justify-center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <p>Loading dashboard data...</p>
        </Box>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      {/* spacing from sidebar */}
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400 mt-1">
              Overview of projects, skills, and GitHub activity.
            </p>
            {githubProfile && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {githubProfile.displayName || githubProfile.username}!
              </p>
            )}
          </div>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              color: '#fff',
              borderColor: '#4f46e5',
              '&:hover': {
                borderColor: '#4338ca',
                backgroundColor: 'rgba(79, 70, 229, 0.1)'
              }
            }}
          >
            {refreshing ? 'Syncing...' : 'Sync GitHub'}
          </Button>
        </header>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* top stats */}
        <QuickStats
          stats={[
            { 
              label: "Public Repos", 
              value: githubProfile?.publicRepos || 0 
            },
            { 
              label: "Followers", 
              value: githubProfile?.followers || 0 
            },
            { 
              label: "User Score", 
              value: userScore?.totalScore || 0 
            },
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

            {/* Recent Activity */}
            <RecentActivity
              githubProfile={githubProfile}
              userScore={userScore}
            />
          </div>

          <div className="xl:col-span-1">
            <TechStacksCard
              stacks={githubProfile?.repos ? 
                githubProfile.repos
                  .filter(repo => repo.language)
                  .reduce((acc, repo) => {
                    const existing = acc.find(item => item.name === repo.language);
                    if (existing) {
                      existing.count += 1;
                    } else {
                      acc.push({ name: repo.language, count: 1 });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map(item => ({
                    name: item.name,
                    level: item.count > 3 ? "Advanced" : item.count > 1 ? "Intermediate" : "Beginner"
                  }))
                : [
                    { name: "No data", level: "Unknown" }
                  ]
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
