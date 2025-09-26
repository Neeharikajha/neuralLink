

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import jwt from "jsonwebtoken";

// import authRoutes from "./routes/auth.js";
// import chatRoutes from "./routes/chat.js";
// import scoringRoutes from "./routes/scoring.js";
// import { ChatRoom } from "./models/chat.js";
// import ideasRouter from "./routes/ideas.js"; // ✅ new import

// dotenv.config();

// const app = express();
// const server = createServer(app);

// // Socket.IO setup with CORS
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB working"))
//   .catch((err) => console.error("MongoDB connection failed:", err));

// // Basic test route
// app.get("/", (req, res) => res.send("Chat working"));

// // Routes
// app.use("/auth", authRoutes);
// app.use("/chat", chatRoutes);
// app.use("/api/scoring", scoringRoutes);
// app.use("/api/ideas", ideasRouter); // ✅ new route

// // Socket.IO authentication middleware
// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("Authentication error: No token provided"));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.userId = decoded.id;
//     next();
//   } catch (err) {
//     next(new Error("Authentication error: Invalid token"));
//   }
// });

// // Socket.IO connection handling
// io.on("connection", (socket) => {
//   console.log(`User ${socket.userId} connected`);

//   // Join user to their personal room
//   socket.join(`user_${socket.userId}`);

//   // Join chat room
//   socket.on("join_room", async (data) => {
//     try {
//       const { roomId } = data;

//       // Verify user is participant of the room
//       const chatRoom = await ChatRoom.findOne({
//         _id: roomId,
//         "participants.userId": socket.userId,
//         "participants.isActive": true,
//       });

//       if (!chatRoom) {
//         socket.emit("error", { message: "Access denied to this chat room" });
//         return;
//       }

//       socket.join(`room_${roomId}`);
//       socket.emit("joined_room", {
//         roomId,
//         message: "Successfully joined room",
//       });

//       // Notify others in the room
//       socket.to(`room_${roomId}`).emit("user_joined", {
//         userId: socket.userId,
//         message: "User joined the room",
//       });
//     } catch (error) {
//       socket.emit("error", { message: "Failed to join room" });
//     }
//   });

//   // Leave chat room
//   socket.on("leave_room", (data) => {
//     const { roomId } = data;
//     socket.leave(`room_${roomId}`);
//     socket.emit("left_room", { roomId, message: "Left room successfully" });

//     // Notify others in the room
//     socket.to(`room_${roomId}`).emit("user_left", {
//       userId: socket.userId,
//       message: "User left the room",
//     });
//   });

//   // Send message
//   socket.on("send_message", async (data) => {
//     try {
//       const { roomId, content, messageType = "text", replyTo } = data;

//       // Verify user is participant of the room
//       const chatRoom = await ChatRoom.findOne({
//         _id: roomId,
//         "participants.userId": socket.userId,
//         "participants.isActive": true,
//       });

//       if (!chatRoom) {
//         socket.emit("error", { message: "Access denied to this chat room" });
//         return;
//       }

//       // Create new message
//       const newMessage = {
//         senderId: socket.userId,
//         content,
//         messageType,
//         replyTo,
//         timestamp: new Date(),
//       };

//       // Add message to chat room
//       chatRoom.messages.push(newMessage);
//       chatRoom.lastMessage = chatRoom.messages[chatRoom.messages.length - 1]._id;
//       chatRoom.lastActivity = new Date();
//       await chatRoom.save();

//       // Populate sender info
//       await chatRoom.populate("messages.senderId", "phone email authProvider");
//       const messageWithSender = chatRoom.messages[chatRoom.messages.length - 1];

//       // Emit message to all users in the room
//       io.to(`room_${roomId}`).emit("new_message", {
//         message: messageWithSender,
//         roomId,
//       });
//     } catch (error) {
//       console.error("Error sending message:", error);
//       socket.emit("error", { message: "Failed to send message" });
//     }
//   });

//   // Typing indicator
//   socket.on("typing_start", (data) => {
//     const { roomId } = data;
//     socket.to(`room_${roomId}`).emit("user_typing", {
//       userId: socket.userId,
//       isTyping: true,
//     });
//   });

//   socket.on("typing_stop", (data) => {
//     const { roomId } = data;
//     socket.to(`room_${roomId}`).emit("user_typing", {
//       userId: socket.userId,
//       isTyping: false,
//     });
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log(`User ${socket.userId} disconnected`);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import scoringRoutes from "./routes/scoring.js";
import { ChatRoom } from "./models/chat.js";
import ideasRouter from "./routes/ideas.js"; // ✅ new import
import projectRoutes from "./routes/projects.js";
import joinRequestRoutes from "./routes/joinRequests.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Frontend URL from env
const frontendURL = process.env.CLIENT_URL || "http://localhost:5174";

// Allow multiple origins if needed
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

// Global CORS setup
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Basic test route
app.get("/", (req, res) => res.send("Chat working"));

// Routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/api/scoring", scoringRoutes);
app.use("/api/ideas", ideasRouter); // ✅ new route
app.use("/api/projects", projectRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error: No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`);

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Join chat room
  socket.on("join_room", async (data) => {
    try {
      const { roomId } = data;

      const chatRoom = await ChatRoom.findOne({
        _id: roomId,
        "participants.userId": socket.userId,
        "participants.isActive": true
      });

      if (!chatRoom) {
        socket.emit("error", { message: "Access denied to this chat room" });
        return;
      }

      socket.join(`room_${roomId}`);
      socket.emit("joined_room", { roomId, message: "Successfully joined room" });
      socket.to(`room_${roomId}`).emit("user_joined", { userId: socket.userId, message: "User joined the room" });
    } catch (error) {
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Leave chat room
  socket.on("leave_room", (data) => {
    const { roomId } = data;
    socket.leave(`room_${roomId}`);
    socket.emit("left_room", { roomId, message: "Left room successfully" });
    socket.to(`room_${roomId}`).emit("user_left", { userId: socket.userId, message: "User left the room" });
  });

  // Send message
  socket.on("send_message", async (data) => {
    try {
      const { roomId, content, messageType = "text", replyTo } = data;

      const chatRoom = await ChatRoom.findOne({
        _id: roomId,
        "participants.userId": socket.userId,
        "participants.isActive": true
      });

      if (!chatRoom) {
        socket.emit("error", { message: "Access denied to this chat room" });
        return;
      }

      const newMessage = {
        senderId: socket.userId,
        content,
        messageType,
        replyTo,
        timestamp: new Date()
      };

      chatRoom.messages.push(newMessage);
      chatRoom.lastMessage = chatRoom.messages[chatRoom.messages.length - 1]._id;
      chatRoom.lastActivity = new Date();
      await chatRoom.save();

      await chatRoom.populate("messages.senderId", "phone email authProvider");
      const messageWithSender = chatRoom.messages[chatRoom.messages.length - 1];

      io.to(`room_${roomId}`).emit("new_message", { message: messageWithSender, roomId });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Typing indicators
  socket.on("typing_start", (data) => {
    const { roomId } = data;
    socket.to(`room_${roomId}`).emit("user_typing", { userId: socket.userId, isTyping: true });
  });

  socket.on("typing_stop", (data) => {
    const { roomId } = data;
    socket.to(`room_${roomId}`).emit("user_typing", { userId: socket.userId, isTyping: false });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
