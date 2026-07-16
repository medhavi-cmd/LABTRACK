import express from "express";
import verifyResetToken from "../middleware/verifyResetToken.js";
import {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetUserPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post(
  "/reset-password",
  verifyResetToken,
  resetUserPassword
);

export default router;