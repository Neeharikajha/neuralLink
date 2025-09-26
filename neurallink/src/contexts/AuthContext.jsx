import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [githubProfile, setGithubProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/github/profile`);
          setUser(response.data.user);
          setGithubProfile(response.data.githubProfile);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, API_BASE_URL]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const loginWithGitHub = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/github/auth-url`);
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('GitHub login failed:', error);
      return { 
        success: false, 
        error: 'Failed to initiate GitHub login' 
      };
    }
  };

  const handleGitHubCallback = async (token) => {
    try {
      // Token is already provided from the URL, just set it and fetch user data
      setToken(token);
      localStorage.setItem('token', token);
      
      // Set up axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user and GitHub profile data
      const response = await axios.get(`${API_BASE_URL}/auth/github/profile`);
      const { user: userData, githubProfile: githubData } = response.data;
      
      setUser(userData);
      setGithubProfile(githubData);
      
      return { success: true };
    } catch (error) {
      console.error('GitHub callback failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'GitHub authentication failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setGithubProfile(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const syncGitHubData = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/github/sync`);
      
      // Refresh GitHub profile data
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/github/profile`);
      setGithubProfile(profileResponse.data.githubProfile);
      
      return { success: true };
    } catch (error) {
      console.error('GitHub sync failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to sync GitHub data' 
      };
    }
  };

  const value = {
    user,
    githubProfile,
    loading,
    isAuthenticated: !!token,
    login,
    signup,
    loginWithGitHub,
    handleGitHubCallback,
    logout,
    syncGitHubData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
