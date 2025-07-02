import { Router } from "express";
import {
  uploadDocumentToCloudinary,
  uploadImageToCloudinary,
} from "../middlewares/cloudinaryUpload";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFileToCloudinary } from "../controlllers/upload.controller";
import { UploadTypeEnum } from "../types";

const router = Router();

// for single image upload
router.post(
  "/image",
  uploadImageToCloudinary.single("file"),
  asyncHandler((req, res) =>
    uploadFileToCloudinary(req, res, UploadTypeEnum.ProfileImage)
  )
);

// for multiple image upload
router.post(
  "/multiple-images",
  uploadImageToCloudinary.array("files", 10), // 10 is the maximum number of files that can be uploaded at once
  asyncHandler((req, res) =>
    uploadFileToCloudinary(req, res, UploadTypeEnum.Images)
  )
);

// for single document upload
router.post(
  "/document-upload",
  uploadDocumentToCloudinary.single("file"),
  asyncHandler((req, res) =>
    uploadFileToCloudinary(req, res, UploadTypeEnum.Document)
  )
);

export default router;
