import { z } from "zod";
import { INDIAN_STATES_AND_UTS } from "../constants";
import { passwordRegex } from "../config/RegexConfig";
import { UserRole } from "../types";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex),
    username: z.string().min(1),
    name: z.string().min(1),
    role: z.enum([UserRole.Admin, UserRole.Manager, UserRole.User]),
    state: z.enum(INDIAN_STATES_AND_UTS as [string, ...string[]]).optional(),
    // profileImage: z.string().optional(), // We don’t validate file here — multer handles that
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex),
  }),
});
