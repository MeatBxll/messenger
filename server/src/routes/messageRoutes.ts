import express from "express";
import { createMessage, getMessages } from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, createMessage);
router.get("/", authenticateToken, getMessages);

export default router;
