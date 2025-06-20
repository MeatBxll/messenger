import express from "express";
import { getAllUsers, createUser } from "../controllers/userControllers";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);

export default router;
