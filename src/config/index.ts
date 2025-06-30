require("dotenv").config(); // Load environment variables - need to be at top

export const BASE_URL = `${
  process.env.CLIENT_URL || "http://localhost:8080"
}/api/v1`;

export const EMAIL_VERIFICATION_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
export const RESET_PASSWORD_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

// global export env variables
export const PORT = process.env.PORT;
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const CLIENT_URL = process.env.CLIENT_URL;
