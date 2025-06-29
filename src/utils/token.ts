// generate a token for email verification

import crypto from "crypto";

export const generateRandomToken = () => {
  return crypto?.randomBytes(32)?.toString("hex");
};
