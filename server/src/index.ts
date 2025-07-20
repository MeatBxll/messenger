import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import friendRequestRoutes from "./routes/friendRequestsRoutes";
import messageRoutes from "./routes/messageRoutes";

import { messageHandler } from "./socketHandlers/messageHandler";
import { notificationHandler } from "./socketHandlers/notificationHandler";

import session from "express-session";
import passport from "./passportConfig";

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Socket.IO connection setup
io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    console.log(`User ${userId} connected`);
    socket.join(`user:${userId}`);
  }

  messageHandler(socket, io);
  notificationHandler(socket, io);

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//passport.js middleware
app.use(
  session({
    secret: "your-session-secret", // Replace with env var later
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friend-requests", friendRequestRoutes);

app.get("/", (_req, res) => {
  res.send("Server is running 🟢");
});

server.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});
