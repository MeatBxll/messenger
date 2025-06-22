import express from "express";
import {
  getAllUsers,
  createUser,
  getFriends,
  changePfp,
} from "../controllers/userControllers";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/friends", authenticateToken, getFriends);
router.patch("/pfp/:pfpIndex", authenticateToken, changePfp);

export default router;
