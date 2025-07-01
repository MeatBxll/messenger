import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies.token ||
    (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
