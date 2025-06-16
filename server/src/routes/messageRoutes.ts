import express from "express";
import { createMessage } from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, createMessage);

export default router;
