import express from "express";
import {
  getMe,
  login,
  logoutUser,
  refreshToken,
  signInWithGoogle,
} from "../controllers/authControllers";
import { authenticateToken } from "../middleware/auth";
import passport from "../passportConfig";

const router = express.Router();

router.post("/", login);
router.post("/logout", logoutUser);
router.get("/me", authenticateToken, getMe);
router.post("/refresh", refreshToken);

//passport stuff
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  signInWithGoogle
);

export default router;
