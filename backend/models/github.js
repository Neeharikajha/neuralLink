import mongoose from "mongoose";

const githubSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: true,
        unique: true
    },
    githubId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    publicRepos: {
        type: Number,
        default: 0
    },
    publicGists: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    githubUrl: {
        type: String,
        required: true
    },
    repos: [{
        name: String,
        fullName: String,
        description: String,
        language: String,
        stars: Number,
        forks: Number,
        url: String,
        createdAt: Date,
        updatedAt: Date
    }],
    accessToken: {
        type: String,
        required: true
    },
    lastSync: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("GitHubProfile", githubSchema);
