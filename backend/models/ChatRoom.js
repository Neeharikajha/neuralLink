import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: true
    },
    roomCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AuthDetails',
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member'],
            default: 'member'
        }
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AuthDetails',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        messageType: {
            type: String,
            enum: ['text', 'image', 'file', 'system'],
            default: 'text'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    maxParticipants: {
        type: Number,
        default: 50
    }
}, {
    timestamps: true
});

// Generate unique room code
chatRoomSchema.pre('save', async function(next) {
    if (!this.roomCode) {
        const generateCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        
        let code;
        do {
            code = generateCode();
        } while (await this.constructor.findOne({ roomCode: code }));
        
        this.roomCode = code;
    }
    next();
});

export default mongoose.model("ChatRoom", chatRoomSchema);
