// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//     senderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'AuthDetails',
//         required: true
//     },
//     content: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     messageType: {
//         type: String,
//         enum: ['text', 'image', 'file', 'code'],
//         default: 'text'
//     },
//     timestamp: {
//         type: Date,
//         default: Date.now
//     },
//     isEdited: {
//         type: Boolean,
//         default: false
//     },
//     editedAt: {
//         type: Date
//     },
//     replyTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message'
//     }
// });

// const chatRoomSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         trim: true
//     },
//     participants: [{
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'AuthDetails',
//             required: true
//         },
//         joinedAt: {
//             type: Date,
//             default: Date.now
//         },
//         role: {
//             type: String,
//             enum: ['admin', 'moderator', 'member'],
//             default: 'member'
//         },
//         isActive: {
//             type: Boolean,
//             default: true
//         }
//     }],
//     messages: [messageSchema],
//     isPrivate: {
//         type: Boolean,
//         default: false
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'AuthDetails',
//         required: true
//     },
//     lastMessage: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message'
//     },
//     lastActivity: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true
// });

// // Index for better query performance
// chatRoomSchema.index({ 'participants.userId': 1 });
// chatRoomSchema.index({ lastActivity: -1 });

// export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
// export const Message = mongoose.model("Message", messageSchema);

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'code'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
});

const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    participants: [{
        userId: {
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
            enum: ['admin', 'moderator', 'member'],
            default: 'member'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    messages: [messageSchema],
    isPrivate: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthDetails',
        required: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
chatRoomSchema.index({ 'participants.userId': 1 });
chatRoomSchema.index({ lastActivity: -1 });

// Fix for OverwriteModelError
export const ChatRoom = mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
