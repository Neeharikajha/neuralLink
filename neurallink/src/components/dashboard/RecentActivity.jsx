import React from "react";

export default function RecentActivity({ githubProfile, userScore }) {
  if (!githubProfile) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400">No GitHub profile data available</p>
      </div>
    );
  }

  const recentRepos = githubProfile.repos
    ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5) || [];

  const topLanguages = githubProfile.repos
    ?.filter(repo => repo.language)
    .reduce((acc, repo) => {
      const lang = repo.language;
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

  const sortedLanguages = Object.entries(topLanguages || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span>📊</span>
        Recent Activity
      </h2>

      <div className="space-y-6">
        {/* Recent Repositories */}
        <div>
          <h3 className="text-md font-medium text-gray-300 mb-3">Recent Repositories</h3>
          <div className="space-y-3">
            {recentRepos.length > 0 ? (
              recentRepos.map((repo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{repo.name}</h4>
                    <p className="text-xs text-gray-400">{repo.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {repo.language && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stars || 0}</span>
                    <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No repositories found</p>
            )}
          </div>
        </div>

        {/* Top Languages */}
        <div>
          <h3 className="text-md font-medium text-gray-300 mb-3">Top Languages</h3>
          <div className="space-y-2">
            {sortedLanguages.length > 0 ? (
              sortedLanguages.map(([language, count], index) => (
                <div key={language} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <span className="text-sm text-gray-300">{language}</span>
                  </div>
                  <span className="text-sm text-gray-400">{count} repos</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No language data available</p>
            )}
          </div>
        </div>

        {/* User Score Breakdown */}
        {userScore && (
          <div>
            <h3 className="text-md font-medium text-gray-300 mb-3">Score Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Activity Score</span>
                <span className="text-white">{userScore.activityScore?.toFixed(1) || 0}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${Math.min((userScore.activityScore || 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Stats Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{githubProfile.publicRepos || 0}</div>
            <div className="text-xs text-gray-400">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{githubProfile.followers || 0}</div>
            <div className="text-xs text-gray-400">Followers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
