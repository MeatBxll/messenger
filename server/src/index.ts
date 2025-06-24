import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import friendRequestRoutes from "./routes/friendRequestsRoutes";
import messageRoutes from "./routes/messageRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { server } from "./socket/socket";

const app = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//routes
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
