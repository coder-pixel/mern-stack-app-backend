import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  // console.log("plainPassword", plainPassword);
  // console.log("hashedPassword", hashedPassword);
  // ✅ bcrypt.compare() is used to compare the plain password with the hashed password
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d", // Adjust as needed
  });
};

// ---------  older and less secure way ----------

// import crypto from "crypto";

// export const random = () => crypto.randomBytes(128).toString("base64"); // used to generate random salt for password hashing

// export const authentication = (salt: string, password: string) => {
//   return crypto
//     .createHmac("sha256", [salt, password].join("/"))
//     .update(process.env.SECRET!)
//     .digest("hex");
// };
