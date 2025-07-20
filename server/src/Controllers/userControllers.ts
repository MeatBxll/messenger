import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaInstance.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        pfpIndex: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error("Error in getting all users", err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaInstance.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        pfpIndex: 0,
      },
    });

    const payload = { userId: user.id };

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      message: "logged in",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Error creating user" });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) return res.status(400).json({ message: "Invalid User Id" });

  try {
    const user = await prismaInstance.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            email: true,
            pfpIndex: true,
          },
        },
      },
    });

    if (!user) res.status(404).json({ message: "User not found" });

    return res.json({ friends: user!.friends });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong in fetching friends" });
  }
};

export const changePfp = async (req: Request, res: Response) => {
  const userId = req.userId;

  const newPfpId = parseInt(req.params.pfpIndex);

  if (!userId)
    return res.status(400).json({ message: "Authentication Required" });

  if (isNaN(newPfpId) || newPfpId < 0 || newPfpId > 12)
    return res.status(400).json({ message: "Invalid Pfp index" });

  try {
    await prismaInstance.user.update({
      where: { id: userId },
      data: {
        pfpIndex: newPfpId,
      },
    });

    return res.status(201).json({ message: "Pfp index updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error when changing pfp" });
  }
};
