import { Router } from "express";
import {
  login,
  register,
  verifyEmail,
} from "../../controlllers/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

router.get("/verify-email", asyncHandler(verifyEmail));

export default router;
