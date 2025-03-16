import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { dbConnection } from "./config/db_connection.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import groupRoutes from "./routes/group.js";
import { errorHandling } from "./middlewares/error.middleware.js";
import User from "./models/User.js";
import Message from "./models/Message.js";
import Group from "./models/Group.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Connect to Database
dbConnection()
  .then(() => console.log(" Database Connected Successfully"))
  .catch((err) => console.error(" Database Connection Failed:", err));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/group", groupRoutes);

app.use(errorHandling);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("userOnline", async (userId) => {
    await User.findByIdAndUpdate(userId, { online: true });
    io.emit("updateOnlineUsers");
  });
  socket.on("userOffline", async (userId) => {
    await User.findByIdAndUpdate(userId, { online: false });
    io.emit("updateOnlineUsers");
  });

  // socket.on("sendMessage", async (newMessage) => {
  //   try {
  //     const message = newMessage.content;

  //     if (groupId) {
  //       const group = await Group.findById(groupId).populate("members");
  //       group.members.forEach((member) => {
  //         if (onlineUsers.has(member._id.toString())) {
  //           io.to(onlineUsers.get(member._id.toString()).socketId).emit(
  //             "receiveMessage",
  //             message
  //           );
  //         }
  //       });
  //     } else {
  //     io.to(newMessage.room).emit("receiveMessage", message);
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // });

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("typing", ({ room, groupId, username }) => {
    io.to(room || groupId).emit("userTyping", { username });
  });

  socket.on("stopTyping", ({ room, groupId, username }) => {
    io.to(room || groupId).emit("userStoppedTyping", { username });
  });

  socket.on("disconnect", async () => {
    let disconnectedUserId = null;

    for (const [userId, user] of onlineUsers.entries()) {
      if (user.socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      await User.findByIdAndUpdate(disconnectedUserId, { online: false });
      io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
      console.log(` User Disconnected: ${disconnectedUserId}`);
    }

    console.log(" User disconnected:", socket.id);
  });
});
