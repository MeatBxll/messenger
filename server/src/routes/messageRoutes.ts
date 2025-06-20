import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  getMessagesWithUser,
} from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, createMessage);
router.get("/", authenticateToken, getMessages);
router.delete("/:id", authenticateToken, deleteMessage);
router.get("/with/user/:id", authenticateToken, getMessagesWithUser);
export default router;
