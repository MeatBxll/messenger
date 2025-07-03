import express from "express";
import {
  getMe,
  login,
  logoutUser,
  refreshToken,
} from "../controllers/authControllers";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/", login);
router.post("/logout", logoutUser);
router.get("/me", authenticateToken, getMe);
router.post("/refresh", refreshToken);

export default router;
