import ChatRoom from "../models/ChatRoom.js";
import Project from "../models/Project.js";

// Create a new chat room
export const createChatRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, projectId } = req.body;

        const chatRoom = new ChatRoom({
            name,
            description,
            project: projectId,
            owner: userId,
            participants: [{
                user: userId,
                role: 'owner'
            }]
        });

        await chatRoom.save();
        await chatRoom.populate('owner participants.user project');

        res.status(201).json({
            message: "Chat room created successfully",
            chatRoom
        });
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ message: "Failed to create chat room", error: error.message });
    }
};

// Join chat room with code
export const joinChatRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const { roomCode } = req.body;

        const chatRoom = await ChatRoom.findOne({ 
            roomCode: roomCode.toUpperCase(),
            isActive: true 
        });

        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found or inactive" });
        }

        // Check if user is already a participant
        const existingParticipant = chatRoom.participants.find(p => p.user.toString() === userId);
        if (existingParticipant) {
            return res.status(400).json({ message: "Already a participant in this room" });
        }

        // Check if room is full
        if (chatRoom.participants.length >= chatRoom.maxParticipants) {
            return res.status(400).json({ message: "Chat room is full" });
        }

        // Add user to participants
        chatRoom.participants.push({
            user: userId,
            role: 'member'
        });

        await chatRoom.save();
        await chatRoom.populate('participants.user');

        res.status(200).json({
            message: "Successfully joined chat room",
            chatRoom
        });
    } catch (error) {
        console.error("Error joining chat room:", error);
        res.status(500).json({ message: "Failed to join chat room", error: error.message });
    }
};

// Get user's chat rooms
export const getUserChatRooms = async (req, res) => {
    try {
        const userId = req.user.id;

        const chatRooms = await ChatRoom.find({
            'participants.user': userId,
            isActive: true
        })
        .populate('owner participants.user project')
        .sort({ updatedAt: -1 });

        res.status(200).json({ chatRooms });
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({ message: "Failed to fetch chat rooms", error: error.message });
    }
};

// Get chat room by ID
export const getChatRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const chatRoom = await ChatRoom.findOne({
            _id: roomId,
            'participants.user': userId,
            isActive: true
        })
        .populate('owner participants.user project messages.sender');

        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found or access denied" });
        }

        res.status(200).json({ chatRoom });
    } catch (error) {
        console.error("Error fetching chat room:", error);
        res.status(500).json({ message: "Failed to fetch chat room", error: error.message });
    }
};

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { content, messageType = 'text' } = req.body;
        const userId = req.user.id;

        const chatRoom = await ChatRoom.findOne({
            _id: roomId,
            'participants.user': userId,
            isActive: true
        });

        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found or access denied" });
        }

        const message = {
            sender: userId,
            content,
            messageType,
            timestamp: new Date()
        };

        chatRoom.messages.push(message);
        await chatRoom.save();

        await chatRoom.populate('messages.sender', 'email');

        res.status(201).json({
            message: "Message sent successfully",
            newMessage: chatRoom.messages[chatRoom.messages.length - 1]
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

// Leave chat room
export const leaveChatRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }

        // Remove user from participants
        chatRoom.participants = chatRoom.participants.filter(p => p.user.toString() !== userId);
        
        // If owner leaves and there are other participants, transfer ownership
        if (chatRoom.owner.toString() === userId && chatRoom.participants.length > 0) {
            chatRoom.owner = chatRoom.participants[0].user;
            chatRoom.participants[0].role = 'owner';
        }

        await chatRoom.save();

        res.status(200).json({ message: "Successfully left chat room" });
    } catch (error) {
        console.error("Error leaving chat room:", error);
        res.status(500).json({ message: "Failed to leave chat room", error: error.message });
    }
};

// Get room by code (for joining)
export const getRoomByCode = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const chatRoom = await ChatRoom.findOne({ 
            roomCode: roomCode.toUpperCase(),
            isActive: true 
        })
        .populate('owner project');

        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }

        res.status(200).json({ chatRoom });
    } catch (error) {
        console.error("Error fetching room by code:", error);
        res.status(500).json({ message: "Failed to fetch room", error: error.message });
    }
};