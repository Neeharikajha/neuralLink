// routes/ideas.js
import express from "express";
import Idea from "../models/Idea.js";

const router = express.Router();

// Get all ideas
router.get("/", async (req, res) => {
  const ideas = await Idea.find().sort({ createdAt: -1 });
  res.json(ideas);
});

// Post a new idea
router.post("/", async (req, res) => {
  const idea = new Idea(req.body);
  await idea.save();
  res.status(201).json(idea);
});

// Add collaborator to an idea
router.post("/:id/collaborators", async (req, res) => {
  const { id } = req.params;
  const idea = await Idea.findById(id);
  idea.collaborators.push(req.body);
  await idea.save();
  res.json(idea);
});

export default router;
