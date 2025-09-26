import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    techStack: [{
        type: String,
        required: true
    }],
    requirements: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: true
    },
    githubProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GitHubProfile',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'cancelled'],
        default: 'active'
    },
    maxContributors: {
        type: Number,
        default: 5
    },
    currentContributors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails'
    }],
    tags: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    timeCommitment: {
        type: String,
        enum: ['part-time', 'full-time', 'weekend'],
        default: 'part-time'
    },
    projectUrl: {
        type: String
    },
    repositoryUrl: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("Project", projectSchema);
