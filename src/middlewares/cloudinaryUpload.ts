import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";
import { AppError } from "../utils/AppError";

const storageImage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    // Why care about public_id? It's how you refer to the image later for deletion, updates, or specific transformations. A predictable or unique public_id is beneficial
    public_id: (req: any, file: Express.Multer.File) => {
      // user_timestamp_filename
      return `user_${Date.now()}_${file?.originalname?.split(".")[0]}`;
    },
    // generate a unique public id for the image, otherwise cloudinary will generate a random one by default, better to manage it on our own
    // transformation: [{ width: 500, height: 500, crop: "limit" }], // transform the image to 500x500 and crop it if it's too large, useful for performance, but we are not using it here because we will upload full size images and then later when we display them we will resize them using cloudinary's image transformation
  } as any, // Temporary workaround for type issues if above doesn't fix it immediately,
});

// Middleware to upload images to Cloudinary
export const uploadImageToCloudinary = multer({
  storage: storageImage,
  limits: { fileSize: 1024 * 1024 * 5 }, // max 5MB files are allowed
  fileFilter: (req, file, cb) => {
    // We've done allowedFormats in params, but a fileFilter here can provide more immediate feedback for client-side errors.
    if (!file.mimetype.startsWith("image")) {
      cb(new AppError("Only image files are allowed.", 400));
    }
    cb(null, true);
  },
});

const storageFile = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "files",
    allowed_formats: ["doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx"],
    // Why care about public_id? It's how you refer to the image later for deletion, updates, or specific transformations. A predictable or unique public_id is beneficial
    public_id: (req: any, file: Express.Multer.File) => {
      // user_timestamp_filename
      return `user_${Date.now()}_${file?.originalname?.split(".")[0]}`;
    },
  } as any,
});

// Middleware to upload files like doc, pdf, etc to Cloudinary
export const uploadDocumentToCloudinary = multer({
  storage: storageFile,
  limits: { fileSize: 1024 * 1024 * 5 }, // max 5MB files are allowed
  fileFilter: (req, file, cb) => {
    // We've done allowedFormats in params, but a fileFilter here can provide more immediate feedback for client-side errors.
    if (!file.mimetype.startsWith("application")) {
      cb(new AppError("Only files are allowed.", 400));
    }
    cb(null, true);
  },
});
