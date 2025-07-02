import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../../controlllers/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { registerSchema } from "../../validations/auth.schema";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema) as any,
  asyncHandler(register)
);
router.post("/login", asyncHandler(login));

// verify email
router.get("/verify-email", asyncHandler(verifyEmail));

// resend verification email
router.post(
  "/resend-verification-email",
  asyncHandler(resendVerificationEmail)
);

// forgot password
router.post("/forgot-password", asyncHandler(forgotPassword));

// reset password
router.post("/reset-password", asyncHandler(resetPassword)); // frontend sends ?token=... + new password

export default router;
