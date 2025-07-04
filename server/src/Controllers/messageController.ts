import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";

export const createMessage = async (req: Request, res: Response) => {
  const { content, recipientId } = req.body;
  const userId = req.userId;

  console.log("Incoming Message:", { content, recipientId, userId });

  if (!content || !recipientId || !userId) {
    return res
      .status(400)
      .json({ message: "Missing content, User Id, or Recipient Id" });
  }

  try {
    const message = await prismaInstance.message.create({
      data: {
        content,
        senderId: userId!,
        recipientId: parseInt(recipientId),
      },
    });

    return res.status(201).json({ message });
  } catch (error) {
    console.error("❌ Error in createMessage:", error);
    return res.status(500).json({ message: "Error sending message" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Not Authenticated" });

  try {
    const messages = prismaInstance.message.findMany({
      where: { senderId: userId },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ messages });
  } catch (err: any) {
    return res
      .status(404)
      .json({ message: "something went wrong in getting messages" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const userId = req.userId;
  const messageId = parseInt(req.params.id);

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (isNaN(messageId)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const message = await prismaInstance.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.senderId !== userId) {
      return res.status(403).json({ message: "You can't delete this message" });
    }

    await prismaInstance.message.delete({ where: { id: messageId } });

    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete message" });
  }
};

export const getMessagesWithUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const otherUserId = parseInt(req.params.id);
  if (!userId || isNaN(otherUserId)) {
    return res.status(401).json({ message: "Invalid request" });
  }

  try {
    const messages = await prismaInstance.message.findMany({
      where: {
        OR: [
          { senderId: otherUserId, recipientId: userId },
          { senderId: userId, recipientId: otherUserId },
        ],
      },

      orderBy: { createdAt: "asc" },
    });

    return res.json(messages);
  } catch (err) {
    res.status(401).json({ message: "Error when getting messages" });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({ message: "Authorization Required" });
  }

  try {
    const messages = await prismaInstance.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, pfpIndex: true } },
        recipient: { select: { id: true, name: true, pfpIndex: true } },
      },
    });
    const conversationsMap = new Map<number, (typeof messages)[0]>();

    for (const message of messages) {
      const otherUser =
        message.senderId === userId ? message.recipient : message.sender;

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, message);
      }
    }

    const conversations = Array.from(conversationsMap.values()).map((msg) => {
      const otherUser = msg.senderId === userId ? msg.recipient : msg.sender;

      return {
        user: otherUser,
        lastMessage: msg.content,
        timestamp: msg.createdAt,
      };
    });

    return res.json({ conversations });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
