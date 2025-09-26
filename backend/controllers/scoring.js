import GitHub from "../models/github.js";
import Auth from "../models/auth.js";
import axios from "axios";

// Calculate user score based on GitHub data
export const calculateUserScore = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const githubProfile = await GitHub.findOne({ userId });
        if (!githubProfile) {
            return res.status(404).json({ message: "GitHub profile not found" });
        }

        // Calculate score based on GitHub data
        const score = calculateScore(githubProfile);
        
        res.status(200).json({
            message: "Score calculated successfully",
            score
        });
    } catch (error) {
        console.error("Error calculating score:", error);
        res.status(500).json({ message: "Failed to calculate score", error: error.message });
    }
};

// Calculate score for all users (for matching)
export const calculateAllScores = async (req, res) => {
    try {
        const githubProfiles = await GitHub.find().populate('userId');
        const scores = [];

        for (const profile of githubProfiles) {
            const score = calculateScore(profile);
            scores.push({
                userId: profile.userId._id,
                username: profile.username,
                score
            });
        }

        res.status(200).json({
            message: "All scores calculated successfully",
            scores
        });
    } catch (error) {
        console.error("Error calculating all scores:", error);
        res.status(500).json({ message: "Failed to calculate all scores", error: error.message });
    }
};

// Helper function to calculate score based on GitHub data
function calculateScore(githubProfile) {
    const {
        publicRepos,
        followers,
        following,
        repos = []
    } = githubProfile;

    // Calculate repository metrics
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stars || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks || 0), 0);
    const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
    
    // Calculate activity score (based on repository activity)
    const recentRepos = repos.filter(repo => {
        const updatedAt = new Date(repo.updatedAt);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return updatedAt > sixMonthsAgo;
    });

    // Base score calculation
    let score = 0;
    
    // Repository count (max 30 points)
    score += Math.min(publicRepos * 2, 30);
    
    // Followers (max 20 points)
    score += Math.min(followers * 0.5, 20);
    
    // Stars (max 25 points)
    score += Math.min(totalStars * 0.1, 25);
    
    // Activity (max 15 points)
    score += Math.min(recentRepos.length * 3, 15);
    
    // Language diversity (max 10 points)
    score += Math.min(languages.length * 2, 10);

    // Normalize to 0-100
    const normalizedScore = Math.min(Math.round(score), 100);

    return {
        totalScore: normalizedScore,
        breakdown: {
            repositoryCount: Math.min(publicRepos * 2, 30),
            followers: Math.min(followers * 0.5, 20),
            stars: Math.min(totalStars * 0.1, 25),
            activity: Math.min(recentRepos.length * 3, 15),
            languageDiversity: Math.min(languages.length * 2, 10)
        },
        metrics: {
            publicRepos,
            followers,
            following,
            totalStars,
            totalForks,
            languages: languages.slice(0, 5), // Top 5 languages
            recentRepos: recentRepos.length
        }
    };
}

// Get user compatibility score with a project
export const calculateCompatibilityScore = async (req, res) => {
    try {
        const { projectTopics, adminTopics } = req.body;
        const userId = req.user.id;
        
        const githubProfile = await GitHub.findOne({ userId });
        if (!githubProfile) {
            return res.status(404).json({ message: "GitHub profile not found" });
        }

        // Extract topics from user's repositories
        const userTopics = [...new Set(githubProfile.repos.map(repo => repo.language).filter(Boolean))];
        
        // Calculate relevance scores
        const projectRelevance = calculateRelevance(userTopics, projectTopics || []);
        const adminCompatibility = calculateRelevance(userTopics, adminTopics || []);
        
        // Calculate final score
        const finalScore = (
            projectRelevance * 0.4 +
            adminCompatibility * 0.3 +
            (githubProfile.followers / 100) * 0.3
        ) * 100;

        res.status(200).json({
            message: "Compatibility score calculated successfully",
            score: {
                finalScore: Math.min(Math.round(finalScore), 100),
                projectRelevance: Math.round(projectRelevance * 100),
                adminCompatibility: Math.round(adminCompatibility * 100),
                userTopics
            }
        });
    } catch (error) {
        console.error("Error calculating compatibility score:", error);
        res.status(500).json({ message: "Failed to calculate compatibility score", error: error.message });
    }
};

// Helper function to calculate relevance between two topic arrays
function calculateRelevance(topics1, topics2) {
    if (!topics1.length || !topics2.length) return 0;
    
    const set1 = new Set(topics1.map(t => t.toLowerCase()));
    const set2 = new Set(topics2.map(t => t.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
}
