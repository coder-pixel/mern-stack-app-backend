import { Router } from "express";
import { uploadImageToCloudinary } from "../middlewares/cloudinaryUpload";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFileToCloudinary } from "../controlllers/upload.controller";

const router = Router();

// for single image upload
router.post(
  "/image",
  uploadImageToCloudinary.single("file"),
  asyncHandler(uploadFileToCloudinary)
);

// for multiple image upload
router.post(
  "/multiple-images",
  uploadImageToCloudinary.array("files", 10), // 10 is the maximum number of files that can be uploaded at once
  asyncHandler(uploadFileToCloudinary)
);

export default router;
