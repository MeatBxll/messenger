import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";

export const sendFriendRequest = async (req: Request, res: Response) => {
  const senderId = req.userId;
  const receiverId = parseInt(req.params.receiverId);

  if (!senderId || isNaN(receiverId)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ message: "Cannot send friend request to yourself" });
  }

  try {
    const existingFriend = await prismaInstance.user.findFirst({
      where: {
        id: senderId,
        friends: {
          some: { id: receiverId },
        },
      },
    });

    if (existingFriend) {
      return res.status(400).json({ message: "You are already friends" });
    }

    const existingRequest = await prismaInstance.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
        status: "pending",
      },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already pending" });
    }

    await prismaInstance.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
      },
    });

    return res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getIncomingRequests = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const requests = await prismaInstance.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            pfpIndex: true,
          },
        },
      },
    });

    return res.json({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch friend requests" });
  }
};

export const respondToRequest = async (req: Request, res: Response) => {
  const userId = req.userId;
  const requestId = parseInt(req.params.requestId);
  const { action } = req.body;

  if (!userId || isNaN(requestId) || !["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const request = await prismaInstance.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.receiverId !== userId) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (action === "accept") {
      await prismaInstance.user.update({
        where: { id: userId },
        data: {
          friends: {
            connect: { id: request.senderId },
          },
        },
      });

      await prismaInstance.user.update({
        where: { id: request.senderId },
        data: {
          friends: {
            connect: { id: userId },
          },
        },
      });

      await prismaInstance.friendRequest.delete({
        where: { id: requestId },
      });

      return res.json({ message: "Friend request accepted" });
    }

    await prismaInstance.friendRequest.delete({
      where: { id: requestId },
    });

    return res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error responding to request" });
  }
};
