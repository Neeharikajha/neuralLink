import Project from "../models/Project.js";
import JoinRequest from "../models/JoinRequest.js";
import GitHub from "../models/github.js";
import Auth from "../models/auth.js";

// Create a new project
export const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, techStack, requirements, tags, difficulty, timeCommitment, projectUrl, repositoryUrl } = req.body;

        // Get user's GitHub profile
        const githubProfile = await GitHub.findOne({ userId });
        if (!githubProfile) {
            return res.status(400).json({ message: "GitHub profile not found. Please connect your GitHub account first." });
        }

        const project = new Project({
            title,
            description,
            techStack,
            requirements,
            owner: userId,
            githubProfile: githubProfile._id,
            tags,
            difficulty,
            timeCommitment,
            projectUrl,
            repositoryUrl
        });

        await project.save();
        await project.populate('owner githubProfile');

        res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
};

// Get all projects
export const getAllProjects = async (req, res) => {
    try {
        const { status = 'active', limit = 20, page = 1 } = req.query;
        
        const projects = await Project.find({ status })
            .populate('owner githubProfile currentContributors')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Project.countDocuments({ status });

        res.status(200).json({
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
};

// Get project by ID
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const project = await Project.findById(id)
            .populate('owner githubProfile currentContributors');

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: "Failed to fetch project", error: error.message });
    }
};

// Get user's projects
export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const projects = await Project.find({ owner: userId })
            .populate('githubProfile currentContributors')
            .sort({ createdAt: -1 });

        res.status(200).json({ projects });
    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.status(500).json({ message: "Failed to fetch user projects", error: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is the owner
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to update this project" });
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner githubProfile currentContributors');

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Failed to update project", error: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is the owner
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this project" });
        }

        // Delete all join requests for this project
        await JoinRequest.deleteMany({ project: id });

        await Project.findByIdAndDelete(id);

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
};
