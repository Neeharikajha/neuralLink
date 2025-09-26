import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class GitHubService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Get GitHub profile data
  async getGitHubProfile() {
    try {
      const response = await this.api.get('/auth/github/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      throw error;
    }
  }

  // Sync GitHub data
  async syncGitHubData() {
    try {
      const response = await this.api.post('/auth/github/sync');
      return response.data;
    } catch (error) {
      console.error('Error syncing GitHub data:', error);
      throw error;
    }
  }

  // Get user score
  async getUserScore() {
    try {
      const response = await this.api.get('/api/scoring/user-score');
      return response.data;
    } catch (error) {
      console.error('Error fetching user score:', error);
      throw error;
    }
  }

  // Get all users scores (for matching)
  async getAllScores() {
    try {
      const response = await this.api.get('/api/scoring/all-scores');
      return response.data;
    } catch (error) {
      console.error('Error fetching all scores:', error);
      throw error;
    }
  }

  // Calculate compatibility score
  async calculateCompatibilityScore(projectTopics, adminTopics) {
    try {
      const response = await this.api.post('/api/scoring/compatibility', {
        projectTopics,
        adminTopics
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating compatibility score:', error);
      throw error;
    }
  }

  // Get GitHub contribution data (mock for now, would need GitHub API integration)
  async getContributionData() {
    try {
      // This would ideally fetch from GitHub API
      // For now, return mock data
      const mockData = this.generateMockContributionData();
      return { data: mockData };
    } catch (error) {
      console.error('Error fetching contribution data:', error);
      throw error;
    }
  }

  // Generate mock contribution data
  generateMockContributionData() {
    const data = {};
    const today = new Date();
    
    for (let i = 0; i < 180; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().slice(0, 10);
      
      // Generate realistic contribution data
      const random = Math.random();
      if (random < 0.3) {
        data[key] = 0; // No contributions
      } else if (random < 0.6) {
        data[key] = Math.floor(Math.random() * 3) + 1; // 1-3 contributions
      } else if (random < 0.8) {
        data[key] = Math.floor(Math.random() * 3) + 4; // 4-6 contributions
      } else {
        data[key] = Math.floor(Math.random() * 5) + 7; // 7-11 contributions
      }
    }
    
    return data;
  }
}

export default new GitHubService();
