import express from "express";
import {
    createChatRoom,
    joinChatRoom,
    getUserChatRooms,
    getChatRoom,
    sendMessage,
    leaveChatRoom,
    getRoomByCode
} from "../controllers/chat.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/rooms", createChatRoom);
router.post("/join", joinChatRoom);
router.get("/rooms", getUserChatRooms);
router.get("/rooms/:roomId", getChatRoom);
router.post("/rooms/:roomId/messages", sendMessage);
router.delete("/rooms/:roomId/leave", leaveChatRoom);
router.get("/code/:roomCode", getRoomByCode);

export default router;