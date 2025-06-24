import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { messageHandler } from "./handlers/messageHandler";
import { notificationHandler } from "./handlers/notificationHandler";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    console.log(`User ${userId} connected`);
    socket.join(`user:${userId}`);
  }

  messageHandler(socket, io);
  notificationHandler(socket, io);

  socket.on("disconnect", () => {
    console.log(` User ${userId} disconnected`);
  });
});

export { server };
