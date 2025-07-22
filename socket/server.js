import { db } from "../lib/prisma.js";
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
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on("joinRoom", async ({ username, room, avatarUrl }) => {
    try {
      users[socket.id] = { username, room, avatarUrl };
      socket.join(room);

      console.log(`👤 ${username} joined room "${room}"`);

      // Ensure the room exists
      await db.room.upsert({
        where: { id: room },
        update: {},
        create: { id: room },
      });

      // Add or update the user in DB
      await db.user.upsert({
        where: { id: socket.id },
        update: {
          username,
          avatar: avatarUrl,
          roomId: room,
        },
        create: {
          id: socket.id,
          username,
          avatar: avatarUrl,
          roomId: room,
        },
      });


      // Notify room
      io.to(room).emit("message", {
        username: "Server",
        message: `${username} joined the room.`,

      });
    } catch (error) {
      console.error("❌ Error in joinRoom:", error);
    }
  });

  socket.on("chatMessage", (message) => {
    const user = users[socket.id];
    if (!user) return;

    io.to(user.room).emit("message", {
      username: user.username,
      message,
    });

    console.log(`💬 ${user.username} in "${user.room}": ${message}`);
  });

  socket.on("disconnect", async () => {
    const user = users[socket.id];

    if (user) {
      const { room, username } = user;

      io.to(room).emit("message", {
        username: "Server",
        message: `${username} left the room.`,
      });


      console.log(`❌ ${username} disconnected from room "${room}"`);
      delete users[socket.id];
      await db.user.delete({
        where:{id:socket.id}
      })

      // Check if any users are left in the room
      const usersInRoom = Object.values(users).filter((u) => u.room === room);
      if (usersInRoom.length === 0) {
        console.log(`🧹 Room "${room}" is now empty. Cleaning up...`);
        try {
          await db.room.delete({
            where: { id: room },
          });
          console.log(`✅ Room "${room}" deleted from DB.`);
        } catch (err) {
          console.error(`❌ Failed to delete room "${room}":`, err);
        }
      }
    } else {
      console.log(`❌ Orphan socket disconnected: ${socket.id}`);
    }
  });
});

server.listen(3001, () => {
  console.log("🚀 Socket.IO server running at http://localhost:3001");
});
