// routes/github.js
import express from "express";
import { protect } from "../middleware/auth.js";
import GitHubProfile from "../models/github.js";
import { githubCallback, getGitHubProfile, syncGitHubData, getGitHubAuthUrl } from "../controllers/githubAuth.js";

const router = express.Router();

// OAuth endpoints
router.get("/auth-url", getGitHubAuthUrl);
router.get("/callback", githubCallback);

// Current user profile (clean version for UI)
router.get("/me", protect, async (req, res) => {
  try {
    const profile = await GitHubProfile.findOne({ userId: req.user.id }).select("+lastSync -accessToken -__v");
    if (!profile) return res.status(404).json({ message: "GitHub profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Optional: raw profile or sync endpoints you already had
router.get("/profile", protect, getGitHubProfile);
router.post("/sync", protect, syncGitHubData);

export default router;
