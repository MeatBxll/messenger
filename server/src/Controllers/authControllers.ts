import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Profile } from "passport";

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

    if (user.provider != "local") {
      return res.status(400).json({
        message: `User Account linked to ${user.provider} sign in with that`,
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password!);

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

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  try {
    const user = await prismaInstance.user.findUnique({
      where: { id: userId },
      include: {
        receivedRequests: {
          include: {
            sender: true,
          },
        },
        sentRequests: {
          include: {
            receiver: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const signInWithGoogle = async (req: Request, res: Response) => {
  const profile = req.user as Profile;

  if (!profile) {
    return res.status(400).json({ message: "No Google profile found" });
  }

  const googleId = profile.id;
  const email = profile.emails?.[0].value;
  const name = profile.displayName;

  if (!email) {
    return res.status(400).json({ message: "Google profile missing email" });
  }

  let user = await prismaInstance.user.findUnique({
    where: {
      provider_providerId: {
        provider: "google",
        providerId: googleId,
      },
    },
  });

  if (!user) {
    user = await prismaInstance.user.create({
      data: {
        name,
        email,
        provider: "google",
        providerId: googleId,
        pfpIndex: Math.floor(Math.random() * 5),
      },
    });
  }

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
};
