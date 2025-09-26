import express from "express";
import { protect } from "../middleware/auth.js";
import { 
    calculateUserScore, 
    calculateAllScores, 
    calculateCompatibilityScore,
    getContributionData
} from "../controllers/scoring.js";

const router = express.Router();

// Scoring routes
router.get("/user-score", protect, calculateUserScore);
router.get("/all-scores", protect, calculateAllScores);
router.get("/contribution-data", protect, getContributionData);
router.post("/compatibility", protect, calculateCompatibilityScore);

export default router;
