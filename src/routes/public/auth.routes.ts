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
import { uploadImageToCloudinary } from "../../middlewares/cloudinaryUpload";

const router = Router();

// register
router.post(
  "/register",
  uploadImageToCloudinary.single("profileImage"), // this populates req.body
  // Middleware to handle the file upload being optional and integrate with req.body
  (req, res, next) => {
    if (req.file) {
      // If a file was uploaded, its details (from Cloudinary) are in req.file
      // We can add its URL to req.body so Zod can validate it (if your schema expects it).
      // Make sure your registerSchema expects 'profileImageUrl' as an optional string.
      req.body.profileImage = req.file.path; // Or req.file.secure_url
    } else {
      // No file was uploaded for 'profileImage'.
      // Ensure your Zod schema considers 'profileImageUrl' as optional.
      // req.body.profileImageUrl will naturally be undefined if not set here,
      // which works well with optional Zod fields.
    }
    next(); // Pass control to the next middleware
  },
  validateRequest(registerSchema) as any, // now Zod can work with req.body
  asyncHandler(register)
);

// login
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
