import { Request, Response } from "express";
import prismaInstance from "../prisma/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaInstance.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await prismaInstance.user.create({
      data: { name, email, password },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
};
