import express from "express";
import { getMe, login } from "../controllers/authControllers";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.get("/getMe", authenticateToken, getMe);

export default router;
