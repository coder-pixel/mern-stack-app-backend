import { Router } from "express";
import {
  login,
  register,
  resendVerificationEmail,
  verifyEmail,
} from "../../controlllers/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

// verify email
router.get("/verify-email", asyncHandler(verifyEmail));

// resend verification email
router.post(
  "/resend-verification-email",
  asyncHandler(resendVerificationEmail)
);

export default router;
