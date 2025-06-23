import express from "express";
import {
  createMessage,
  deleteMessage,
  getConversations,
  getMessages,
  getMessagesWithUser,
} from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, createMessage);
router.get("/", authenticateToken, getMessages);
router.delete("/:id", authenticateToken, deleteMessage);
router.get("/with/user/:id", authenticateToken, getMessagesWithUser);
router.get("/conversations", authenticateToken, getConversations);
export default router;
