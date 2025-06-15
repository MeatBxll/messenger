import express from "express";
import { getMe, login } from "../controllers/authControllers";

const router = express.Router();

router.post("/login", login);
router.get("/getMe", getMe);

export default router;
