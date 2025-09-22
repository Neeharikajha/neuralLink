import express from "express";
import { protect } from "../middleware/auth.js";
import {
    createChatRoom,
    getUserChatRooms,
    getChatMessages,
    joinChatRoom,
    leaveChatRoom,
    getDirectMessageRooms
} from "../controllers/chat.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Chat room routes
router.post("/rooms", createChatRoom);
router.get("/rooms", getUserChatRooms);
router.get("/rooms/:roomId/messages", getChatMessages);
router.post("/rooms/:roomId/join", joinChatRoom);
router.post("/rooms/:roomId/leave", leaveChatRoom);

// Direct message routes
router.get("/direct-messages", getDirectMessageRooms);

export default router;
