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
