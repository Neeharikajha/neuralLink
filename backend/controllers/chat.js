import { ChatRoom, Message } from "../models/chat.js";
import Auth from "../models/auth.js";

// Create a new chat room
export const createChatRoom = async (req, res) => {
    try {
        const { name, description, isPrivate = false } = req.body;
        const userId = req.user.id;

        const chatRoom = new ChatRoom({
            name,
            description,
            isPrivate,
            createdBy: userId,
            participants: [{
                userId: userId,
                role: 'admin',
                joinedAt: new Date()
            }]
        });

        await chatRoom.save();
        await chatRoom.populate('participants.userId', 'phone email authProvider');

        res.status(201).json({
            message: "Chat room created successfully",
            chatRoom
        });
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ message: "Failed to create chat room", error: error.message });
    }
};

// Get all chat rooms for a user
export const getUserChatRooms = async (req, res) => {
    try {
        const userId = req.user.id;

        const chatRooms = await ChatRoom.find({
            'participants.userId': userId,
            'participants.isActive': true
        })
        .populate('participants.userId', 'phone email authProvider')
        .populate('lastMessage')
        .populate('createdBy', 'phone email')
        .sort({ lastActivity: -1 });

        res.status(200).json({
            message: "Chat rooms retrieved successfully",
            chatRooms
        });
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({ message: "Failed to fetch chat rooms", error: error.message });
    }
};

// Get messages for a specific chat room
export const getChatMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;
        const { page = 1, limit = 50 } = req.query;

        // Check if user is participant of the room
        const chatRoom = await ChatRoom.findOne({
            _id: roomId,
            'participants.userId': userId,
            'participants.isActive': true
        });

        if (!chatRoom) {
            return res.status(403).json({ message: "Access denied to this chat room" });
        }

        const skip = (page - 1) * limit;
        const messages = await ChatRoom.findById(roomId)
            .select('messages')
            .populate('messages.senderId', 'phone email authProvider')
            .populate('messages.replyTo')
            .slice('messages', [skip, parseInt(limit)]);

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages: messages.messages.reverse() // Show latest messages first
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages", error: error.message });
    }
};

// Join a chat room
export const joinChatRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }

        // Check if user is already a participant
        const existingParticipant = chatRoom.participants.find(
            p => p.userId.toString() === userId
        );

        if (existingParticipant) {
            if (existingParticipant.isActive) {
                return res.status(400).json({ message: "Already a member of this chat room" });
            } else {
                // Reactivate user
                existingParticipant.isActive = true;
                existingParticipant.joinedAt = new Date();
            }
        } else {
            // Add new participant
            chatRoom.participants.push({
                userId: userId,
                role: 'member',
                joinedAt: new Date()
            });
        }

        await chatRoom.save();
        await chatRoom.populate('participants.userId', 'phone email authProvider');

        res.status(200).json({
            message: "Successfully joined chat room",
            chatRoom
        });
    } catch (error) {
        console.error("Error joining chat room:", error);
        res.status(500).json({ message: "Failed to join chat room", error: error.message });
    }
};

// Leave a chat room
export const leaveChatRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }

        const participant = chatRoom.participants.find(
            p => p.userId.toString() === userId
        );

        if (!participant) {
            return res.status(400).json({ message: "Not a member of this chat room" });
        }

        // Mark as inactive instead of removing
        participant.isActive = false;
        await chatRoom.save();

        res.status(200).json({
            message: "Successfully left chat room"
        });
    } catch (error) {
        console.error("Error leaving chat room:", error);
        res.status(500).json({ message: "Failed to leave chat room", error: error.message });
    }
};

// Get user's direct message rooms (for private chats)
export const getDirectMessageRooms = async (req, res) => {
    try {
        const userId = req.user.id;

        const directRooms = await ChatRoom.find({
            isPrivate: true,
            'participants.userId': userId,
            'participants.isActive': true
        })
        .populate('participants.userId', 'phone email authProvider')
        .populate('lastMessage')
        .sort({ lastActivity: -1 });

        res.status(200).json({
            message: "Direct message rooms retrieved successfully",
            directRooms
        });
    } catch (error) {
        console.error("Error fetching direct message rooms:", error);
        res.status(500).json({ message: "Failed to fetch direct message rooms", error: error.message });
    }
};
