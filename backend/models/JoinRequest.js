import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: true
    },
    requesterGitHubProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GitHubProfile',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        required: false
    },
    activityScore: {
        type: Number,
        required: false
    },
    projectRelevanceScore: {
        type: Number,
        required: false
    },
    adminCompatibilityScore: {
        type: Number,
        required: false
    },
    finalScore: {
        type: Number,
        required: false
    },
    teamCompatibilityScore: {
        type: Number,
        required: false
    },
    projectCompatibilityScore: {
        type: Number,
        required: false
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: false
    },
    reviewedAt: {
        type: Date,
        required: false
    },
    rejectionReason: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
joinRequestSchema.index({ project: 1, status: 1 });
joinRequestSchema.index({ requester: 1 });

export default mongoose.model("JoinRequest", joinRequestSchema);
