import { Server, Socket } from "socket.io";

export function notificationHandler(socket: Socket, io: Server) {
  socket.on("friend-request", ({ toUserId }) => {
    io.to(`user:${toUserId}`).emit("notification", {
      type: "friend_request",
      message: "You got a new friend request!",
    });
  });
}
