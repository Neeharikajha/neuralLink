
// import mongoose from "mongoose";

// const repoSchema = new mongoose.Schema({
//   name: String,
//   fullName: String,
//   description: String,
//   language: String,
//   stars: Number,
//   forks: Number,
//   url: String,
//   createdAt: Date,
//   updatedAt: Date
// }, { _id: false });

// const githubSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthDetails", required: true, unique: true },
//   githubId: { type: String, required: true, unique: true, index: true },
//   username: { type: String, required: true, index: true },
//   displayName: { type: String, required: true },
//   email: { type: String },
//   avatar: { type: String },
//   bio: { type: String },
//   location: { type: String },
//   publicRepos: { type: Number, default: 0 },
//   publicGists: { type: Number, default: 0 },
//   followers: { type: Number, default: 0 },
//   following: { type: Number, default: 0 },
//   githubUrl: { type: String, required: true },
//   repos: [repoSchema],
//   accessToken: { type: String, required: true, select: false },
//   lastSync: { type: Date, default: Date.now }
// }, { timestamps: true });

// export default mongoose.model("GitHubProfile", githubSchema);


import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
  username: String,
  contributions: Number
}, { _id: false });

const repoSchema = new mongoose.Schema({
  name: String,
  fullName: String,
  description: String,
  language: String,
  stars: Number,
  forks: Number,
  url: String,
  private: Boolean,
  size: Number,
  openIssues: Number,
  watchers: Number,
  defaultBranch: String,
  topics: [String],
  archived: Boolean,
  lastPush: Date,
  contributors: [contributorSchema],
  createdAt: Date,
  updatedAt: Date
}, { _id: false });

const githubSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthDetails", required: true, unique: true },
  githubId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, index: true },
  displayName: { type: String, required: true },
  email: { type: String },
  avatar: { type: String },
  bio: { type: String },
  location: { type: String },
  publicRepos: { type: Number, default: 0 },
  publicGists: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  githubUrl: { type: String, required: true },
  repos: [repoSchema],
  accessToken: { type: String, required: true, select: false },
  lastSync: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("GitHubProfile", githubSchema);
