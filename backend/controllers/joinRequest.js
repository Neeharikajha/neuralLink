import JoinRequest from "../models/JoinRequest.js";
import Project from "../models/Project.js";
import GitHub from "../models/github.js";
import Auth from "../models/auth.js";

// Request to join a project
export const requestToJoin = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId, message } = req.body;

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is not the owner
        if (project.owner.toString() === userId) {
            return res.status(400).json({ message: "Cannot request to join your own project" });
        }

        // Check if already a contributor
        if (project.currentContributors.includes(userId)) {
            return res.status(400).json({ message: "Already a contributor to this project" });
        }

        // Check if already requested
        const existingRequest = await JoinRequest.findOne({
            project: projectId,
            requester: userId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Already requested to join this project" });
        }

        // Get requester's GitHub profile
        const requesterGitHubProfile = await GitHub.findOne({ userId });
        if (!requesterGitHubProfile) {
            return res.status(400).json({ message: "GitHub profile not found. Please connect your GitHub account first." });
        }

        // Get project owner's GitHub profile and current contributors for scoring
        const ownerGitHubProfile = await GitHub.findOne({ userId: project.owner });
        const currentContributors = await GitHub.find({ 
            userId: { $in: project.currentContributors } 
        });

        // Calculate compatibility scores using ML service
        let compatibilityScores = {
            projectCompatibilityScore: 0,
            teamCompatibilityScore: 0,
            finalScore: 0
        };

        if (ownerGitHubProfile) {
            const { calculateCompatibilityScore } = await import('../services/mlService.js');
            compatibilityScores = await calculateCompatibilityScore(
                requesterGitHubProfile,
                project.techStack,
                ownerGitHubProfile,
                currentContributors
            );
        }

        // Activity score based on GitHub stats
        const activityScore = Math.min(
            (requesterGitHubProfile.publicRepos * 2 + 
             requesterGitHubProfile.followers * 0.5 + 
             requesterGitHubProfile.following * 0.3), 100
        );

        const joinRequest = new JoinRequest({
            project: projectId,
            requester: userId,
            requesterGitHubProfile: requesterGitHubProfile._id,
            message,
            activityScore,
            projectRelevanceScore: compatibilityScores.projectCompatibilityScore,
            adminCompatibilityScore: compatibilityScores.teamCompatibilityScore,
            finalScore: compatibilityScores.finalScore
        });

        await joinRequest.save();
        await joinRequest.populate('project requester requesterGitHubProfile');

        res.status(201).json({
            message: "Join request submitted successfully",
            joinRequest
        });
    } catch (error) {
        console.error("Error creating join request:", error);
        res.status(500).json({ message: "Failed to create join request", error: error.message });
    }
};

// Get join requests for a project (admin only)
export const getProjectJoinRequests = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        // Check if user is the project owner
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to view join requests for this project" });
        }

        const joinRequests = await JoinRequest.find({ project: projectId })
            .populate('requester requesterGitHubProfile')
            .sort({ finalScore: -1, createdAt: -1 });

        res.status(200).json({ joinRequests });
    } catch (error) {
        console.error("Error fetching join requests:", error);
        res.status(500).json({ message: "Failed to fetch join requests", error: error.message });
    }
};

// Get user's join requests
export const getUserJoinRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const joinRequests = await JoinRequest.find({ requester: userId })
            .populate('project')
            .sort({ createdAt: -1 });

        res.status(200).json({ joinRequests });
    } catch (error) {
        console.error("Error fetching user join requests:", error);
        res.status(500).json({ message: "Failed to fetch user join requests", error: error.message });
    }
};

// Approve or reject join request
export const handleJoinRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'
        const userId = req.user.id;

        const joinRequest = await JoinRequest.findById(requestId)
            .populate('project');

        if (!joinRequest) {
            return res.status(404).json({ message: "Join request not found" });
        }

        // Check if user is the project owner
        if (joinRequest.project.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to handle this join request" });
        }

        if (action === 'approve') {
            // Add user to project contributors
            await Project.findByIdAndUpdate(joinRequest.project._id, {
                $addToSet: { currentContributors: joinRequest.requester }
            });

            joinRequest.status = 'approved';
            joinRequest.reviewedBy = userId;
            joinRequest.reviewedAt = new Date();
        } else if (action === 'reject') {
            joinRequest.status = 'rejected';
            joinRequest.reviewedBy = userId;
            joinRequest.reviewedAt = new Date();
            joinRequest.rejectionReason = rejectionReason;
        } else {
            return res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'" });
        }

        await joinRequest.save();

        res.status(200).json({
            message: `Join request ${action}d successfully`,
            joinRequest
        });
    } catch (error) {
        console.error("Error handling join request:", error);
        res.status(500).json({ message: "Failed to handle join request", error: error.message });
    }
};

// Get all join requests (for admin dashboard)
export const getAllJoinRequests = async (req, res) => {
    try {
        const { status, limit = 20, page = 1 } = req.query;
        
        const filter = status ? { status } : {};
        
        const joinRequests = await JoinRequest.find(filter)
            .populate('project requester requesterGitHubProfile')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await JoinRequest.countDocuments(filter);

        res.status(200).json({
            joinRequests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching join requests:", error);
        res.status(500).json({ message: "Failed to fetch join requests", error: error.message });
    }
};
