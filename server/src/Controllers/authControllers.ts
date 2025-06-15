import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prismaInstance.user.findUnique({
    where: { email },
  });

  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch)
    return res.status(401).json({ message: "Passwords Do Not Match" });

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
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const user = await prismaInstance.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
};
