import { Request, Response, NextFunction } from "express";
import prismaInstance from "../prisma/prisma";
import bcrypt from "bcrypt";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaInstance.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name email and password are all required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaInstance.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Error creating user" });
  }
};
