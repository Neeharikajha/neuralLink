import express from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    getUserProjects,
    updateProject,
    deleteProject
} from "../controllers/project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Protected routes
router.use(protect);   // ✅ use protect

router.post("/", createProject);
router.get("/user/my-projects", getUserProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
