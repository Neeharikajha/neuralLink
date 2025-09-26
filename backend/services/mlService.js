import axios from 'axios';

// Simple ML model integration service
// In a real implementation, you would call your Python ML models here

export const calculateUserScore = async (githubProfile) => {
  try {
    // This is a simplified version of the scoring logic
    // In production, you would call your Python ML service
    
    const {
      publicRepos = 0,
      followers = 0,
      following = 0,
      repos = []
    } = githubProfile;

    // Calculate basic activity score
    let activityScore = 0;
    
    // Repository activity
    activityScore += Math.min(publicRepos * 2, 40);
    
    // Social activity
    activityScore += Math.min(followers * 0.5, 20);
    activityScore += Math.min(following * 0.3, 10);
    
    // Repository quality (stars, forks)
    let repoQualityScore = 0;
    repos.forEach(repo => {
      repoQualityScore += Math.min(repo.stars * 0.1, 5);
      repoQualityScore += Math.min(repo.forks * 0.05, 2);
    });
    activityScore += Math.min(repoQualityScore, 30);
    
    // Normalize to 0-100
    const normalizedScore = Math.min(activityScore, 100);
    
    return {
      totalScore: normalizedScore,
      activityScore: normalizedScore,
      repositoryScore: Math.min(publicRepos * 2, 40),
      socialScore: Math.min(followers * 0.5 + following * 0.3, 30),
      qualityScore: Math.min(repoQualityScore, 30)
    };
  } catch (error) {
    console.error('Error calculating user score:', error);
    return {
      totalScore: 0,
      activityScore: 0,
      repositoryScore: 0,
      socialScore: 0,
      qualityScore: 0
    };
  }
};

export const calculateCompatibilityScore = async (userProfile, projectTechStack, adminProfile) => {
  try {
    // Extract languages from user's repositories
    const userLanguages = userProfile.repos
      .filter(repo => repo.language)
      .map(repo => repo.language);
    
    // Calculate project relevance
    const projectLanguages = projectTechStack || [];
    const commonLanguages = userLanguages.filter(lang => 
      projectLanguages.includes(lang)
    );
    
    const projectRelevanceScore = projectLanguages.length > 0 ? 
      (commonLanguages.length / projectLanguages.length) * 100 : 0;
    
    // Calculate admin compatibility
    const adminLanguages = adminProfile.repos
      .filter(repo => repo.language)
      .map(repo => repo.language);
    
    const adminCommonLanguages = userLanguages.filter(lang => 
      adminLanguages.includes(lang)
    );
    
    const adminCompatibilityScore = adminLanguages.length > 0 ? 
      (adminCommonLanguages.length / adminLanguages.length) * 100 : 0;
    
    // Calculate final compatibility score
    const finalScore = (
      projectRelevanceScore * 0.6 +
      adminCompatibilityScore * 0.4
    );
    
    return {
      projectRelevanceScore,
      adminCompatibilityScore,
      finalScore,
      commonLanguages: commonLanguages,
      adminCommonLanguages: adminCommonLanguages
    };
  } catch (error) {
    console.error('Error calculating compatibility score:', error);
    return {
      projectRelevanceScore: 0,
      adminCompatibilityScore: 0,
      finalScore: 0,
      commonLanguages: [],
      adminCommonLanguages: []
    };
  }
};

export const getContributionData = async (githubProfile) => {
  try {
    // This would normally fetch contribution data from GitHub API
    // For now, return mock data
    const contributionData = {};
    
    // Generate mock contribution data for the last 26 weeks
    const now = new Date();
    for (let i = 0; i < 26; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      
      const weekKey = weekStart.toISOString().split('T')[0];
      contributionData[weekKey] = {
        total: Math.floor(Math.random() * 10),
        week: i,
        days: {
          0: Math.floor(Math.random() * 3),
          1: Math.floor(Math.random() * 3),
          2: Math.floor(Math.random() * 3),
          3: Math.floor(Math.random() * 3),
          4: Math.floor(Math.random() * 3),
          5: Math.floor(Math.random() * 3),
          6: Math.floor(Math.random() * 3)
        }
      };
    }
    
    return contributionData;
  } catch (error) {
    console.error('Error getting contribution data:', error);
    return {};
  }
};
