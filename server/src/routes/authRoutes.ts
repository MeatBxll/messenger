import express from "express";
import { getMe, login, refreshToken } from "../controllers/authControllers";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/", login);
router.get("/getMe", authenticateToken, getMe);
router.post("/refresh", refreshToken);

export default router;
