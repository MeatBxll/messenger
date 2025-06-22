import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getIncomingRequests,
  respondToRequest,
  sendFriendRequest,
} from "../controllers/friendRequestController";

const router = express.Router();

router.get("/", authenticateToken, getIncomingRequests);
router.post("/:receiverId", authenticateToken, sendFriendRequest);
router.post("/:requestId/respond", authenticateToken, respondToRequest);

export default router;
