import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import prismaInstance from "./prisma/prisma";

export function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("send_message", async (data) => {
      const { content, senderId, recipientId } = data;

      if (!content || !senderId || !recipientId) {
        return socket.emit("error", "Invalid message data");
      }

      try {
        const savedMessage = await prismaInstance.message.create({
          data: {
            content,
            senderId,
            recipientId,
          },
        });

        io.emit("new_message", savedMessage);
      } catch (err) {
        console.error("Error saving message:", err);
        socket.emit("error", "Failed to send message");
      }
    });
  });

  return io;
}
