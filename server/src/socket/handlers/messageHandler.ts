import { Server, Socket } from "socket.io";
import prismaInstance from "../../prisma/prisma";

export function messageHandler(socket: Socket, io: Server) {
  socket.on("send-message", async (data) => {
    const { senderId, recipientId, content } = data;

    if (!senderId || !recipientId || !content) return;

    try {
      const message = await prismaInstance.message.create({
        data: {
          senderId,
          recipientId,
          content,
        },
      });

      io.to(`user:${recipientId}`).emit("new-message", message);
      io.to(`user:${senderId}`).emit("new-message", message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  });
}
