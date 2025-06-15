import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prismaInstance.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  return res.json({ message: "logged in" });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(404).json({ message: "Not authenticated" });

  const user = await prismaInstance.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(401).json({ message: "User Not Found" });

  return res.json({ user });
};
