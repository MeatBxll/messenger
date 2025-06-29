import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No Refresh Tokens" });
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET as string) as {
      id: number;
    };

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET as string,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 15,
    });

    return res.json({ message: "Access token refreshed" });
  } catch (err: any) {
    return res.status(403).json({ message: `Error : ${err}` });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prismaInstance.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch)
      return res.status(401).json({ message: "Passwords Do Not Match" });

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_SECRET as string,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.json({
      message: "logged in",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const user = await prismaInstance.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
};
