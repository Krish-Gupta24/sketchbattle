// socket-backend/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // use your frontend domain in prod
    methods: ["GET", "POST"],
  },
});

const users = {};//use obj for fast operations

io.on("connection", (socket) => {
  console.log(`🟢 [${socket.id}] connected`);

  socket.on("joinRoom", ({ username, room }) => {
    users[socket.id] = { username, room };
    socket.join(room);
    console.log("CURRENT USERS",users)
    console.log(`📥 ${username} joined room "${room}", socketid "${socket.id}"`);

    io.to(room).emit("message", {
      username: "Server",
      message: `${username} joined the room.`,
    });
  });

  socket.on("chatMessage", (message) => {
    const user = users[socket.id];
    if (!user) return;
    console.log(`💬 ${user.username}@${user.room}: ${message}`);
    io.to(user.room).emit("message", {
      username: user.username,
      message,
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", {
        username: "Server",
        message: `${user.username} left the room.`,
      });
      console.log(`❌ ${user.username} disconnected from "${user.room}"`);
      delete users[socket.id];
    } else {
      console.log(`❌ [${socket.id}] disconnected`);
    }
  });
});


console.log("users are",users)
server.listen(3001, () => {
  console.log("🚀 Socket.IO server running on http://localhost:3001");
});
