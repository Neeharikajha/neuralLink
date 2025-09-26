import express from "express";
import { protect } from "../middleware/auth.js";
import { 
    calculateUserScore, 
    calculateAllScores, 
    calculateCompatibilityScore 
} from "../controllers/scoring.js";

const router = express.Router();

// Scoring routes
router.get("/user-score", protect, calculateUserScore);
router.get("/all-scores", protect, calculateAllScores);
router.post("/compatibility", protect, calculateCompatibilityScore);

export default router;
