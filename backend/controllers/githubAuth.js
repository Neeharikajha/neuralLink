import axios from "axios";
import Auth from "../models/auth.js";
import GitHub from "../models/github.js";
import jwt from "jsonwebtoken";

// GitHub OAuth callback handler
export const githubCallback = async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({ message: "Authorization code not provided" });
        }

        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return res.status(400).json({ message: "Failed to get access token" });
        }

        // Get user info from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${access_token}`
            }
        });

        const githubUser = userResponse.data;

        // Get user repositories
        const reposResponse = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${access_token}`
            },
            params: {
                sort: 'updated',
                per_page: 20
            }
        });

        const repos = reposResponse.data.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at
        }));

        // Check if user already exists
        let user = await Auth.findOne({ 
            $or: [
                { email: githubUser.email },
                { 'githubProfile.githubId': githubUser.id.toString() }
            ]
        });

        if (!user) {
            // Create new user
            user = new Auth({
                email: githubUser.email || `${githubUser.login}@github.com`,
                authProvider: 'github',
                isVerified: true
            });
            await user.save();
        }

        // Create or update GitHub profile
        const githubProfile = await GitHub.findOneAndUpdate(
            { userId: user._id },
            {
                userId: user._id,
                githubId: githubUser.id.toString(),
                username: githubUser.login,
                displayName: githubUser.name || githubUser.login,
                email: githubUser.email,
                avatar: githubUser.avatar_url,
                bio: githubUser.bio,
                location: githubUser.location,
                publicRepos: githubUser.public_repos,
                publicGists: githubUser.public_gists,
                followers: githubUser.followers,
                following: githubUser.following,
                githubUrl: githubUser.html_url,
                repos: repos,
                accessToken: access_token,
                lastSync: new Date()
            },
            { upsert: true, new: true }
        );

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

        res.status(200).json({
            message: "GitHub authentication successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                authProvider: user.authProvider
            },
            githubProfile: {
                username: githubProfile.username,
                displayName: githubProfile.displayName,
                avatar: githubProfile.avatar,
                publicRepos: githubProfile.publicRepos,
                followers: githubProfile.followers
            }
        });

    } catch (error) {
        console.error("GitHub authentication error:", error);
        res.status(500).json({ message: "GitHub authentication failed", error: error.message });
    }
};

// Get GitHub profile for authenticated user
export const getGitHubProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const githubProfile = await GitHub.findOne({ userId }).populate('userId');
        
        if (!githubProfile) {
            return res.status(404).json({ message: "GitHub profile not found" });
        }

        res.status(200).json({
            message: "GitHub profile retrieved successfully",
            githubProfile
        });

    } catch (error) {
        console.error("Error fetching GitHub profile:", error);
        res.status(500).json({ message: "Failed to fetch GitHub profile", error: error.message });
    }
};

// Sync GitHub data
export const syncGitHubData = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const githubProfile = await GitHub.findOne({ userId });
        
        if (!githubProfile) {
            return res.status(404).json({ message: "GitHub profile not found" });
        }

        // Get updated user info from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${githubProfile.accessToken}`
            }
        });

        const githubUser = userResponse.data;

        // Get updated repositories
        const reposResponse = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${githubProfile.accessToken}`
            },
            params: {
                sort: 'updated',
                per_page: 20
            }
        });

        const repos = reposResponse.data.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at
        }));

        // Update GitHub profile
        await GitHub.findByIdAndUpdate(githubProfile._id, {
            username: githubUser.login,
            displayName: githubUser.name || githubUser.login,
            email: githubUser.email,
            avatar: githubUser.avatar_url,
            bio: githubUser.bio,
            location: githubUser.location,
            publicRepos: githubUser.public_repos,
            publicGists: githubUser.public_gists,
            followers: githubUser.followers,
            following: githubUser.following,
            githubUrl: githubUser.html_url,
            repos: repos,
            lastSync: new Date()
        });

        res.status(200).json({
            message: "GitHub data synced successfully",
            lastSync: new Date()
        });

    } catch (error) {
        console.error("Error syncing GitHub data:", error);
        res.status(500).json({ message: "Failed to sync GitHub data", error: error.message });
    }
};
