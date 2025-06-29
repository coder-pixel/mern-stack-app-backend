// generate a token for email verification or other similar purposes

import crypto from "crypto";

export const generateRandomToken = () => {
  return crypto?.randomBytes(32)?.toString("hex");
};
