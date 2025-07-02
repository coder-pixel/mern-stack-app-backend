import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError";
import {
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from "./index";
// Ensure environment variables are loaded (e.g., using 'dotenv' package)
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "Cloudinary environment variables are not set. Please check your .env file or environment configuration."
  );
  // throw an error if the credentials are missing
  throw new AppError("Cloudinary credentials missing.", 500);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // Always recommended for production to use HTTPS
});

export default cloudinary;
