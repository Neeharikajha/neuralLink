import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techstack: { type: String, required: true },
    requirements: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    collaborators: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        github: String,
        skills: [String],
        score: Number,
        note: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("findProject", IdeaSchema);
