import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";

export const createMessage = async (req: Request, res: Response) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!content)
    res.status(401).json({ message: "Message Content Is Required" });

  try {
    const message = await prismaInstance.message.create({
      data: {
        content,
        senderId: userId,
      },
    });

    res.status(201).json({ message });
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong" });
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
