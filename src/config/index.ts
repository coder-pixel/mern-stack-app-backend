export const BASE_URL = `${
  process.env.CLIENT_URL || "http://localhost:8080"
}/api/v1`;

export const EMAIL_VERIFICATION_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
export const RESET_PASSWORD_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
