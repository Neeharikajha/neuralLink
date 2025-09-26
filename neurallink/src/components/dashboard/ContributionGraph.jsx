import React from "react";

export default function ContributionGraph({ githubProfile }) {
  if (!githubProfile) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
        <h2 className="text-lg font-semibold mb-4">Contribution Graph</h2>
        <p className="text-gray-400">No GitHub profile data available</p>
      </div>
    );
  }

  // Generate mock contribution data for the last 3 years
  const generateContributionData = () => {
    const data = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear - 2; year <= currentYear; year++) {
      const commits = Math.floor(Math.random() * 500) + 50; // Random commits between 50-550
      data.push({
        year,
        commits,
        color: year === currentYear ? 'from-green-400 to-emerald-500' : 
               year === currentYear - 1 ? 'from-blue-400 to-cyan-500' : 
               'from-purple-400 to-pink-500'
      });
    }
    
    return data.sort((a, b) => a.year - b.year);
  };

  const contributionData = generateContributionData();
  const maxCommits = Math.max(...contributionData.map(d => d.commits));

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span>📊</span>
        Contribution Graph
      </h2>

      <div className="space-y-4">
        {contributionData.map(({ year, commits, color }) => (
          <div key={year} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">{year}</span>
              <span className="text-sm text-gray-400">{commits} commits</span>
            </div>
            
            <div className="relative">
              <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color} transition-all duration-700`}
                  style={{ width: `${(commits / maxCommits) * 100}%` }}
                />
              </div>
              
              {/* Year label on the bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white mix-blend-difference">
                  {year}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {contributionData.find(d => d.year === new Date().getFullYear())?.commits || 0}
            </div>
            <div className="text-xs text-gray-400">This Year</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {contributionData.reduce((sum, d) => sum + d.commits, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Commits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(contributionData.reduce((sum, d) => sum + d.commits, 0) / contributionData.length)}
            </div>
            <div className="text-xs text-gray-400">Avg/Year</div>
          </div>
        </div>
      </div>
    </div>
  );
}
