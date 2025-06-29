import { Request, Response } from "express";
import { User } from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";
import {
  createUser,
  getUserByEmail,
  getUserByEmailVerificationToken,
  updateUserById,
} from "../services/user.service";
import { AppError } from "../utils/AppError";
import { generateUserToken } from "../utils";
import { generateRandomToken } from "../utils/token";
import { sendVerificationEmail } from "../utils/email";

export const register = async (req: Request, res: Response): Promise<void> => {
  // try {
  const { email, password, username, role, state } = req.body;

  if (!email || !username || !password) {
    throw new AppError("Some required fields are missing", 400);
    // res
    //   .status(400)
    //   .json({ error: true, message: "Some required fields are missing" });
    // return;
  }

  // check for existing user
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 409);
    // res.status(400).json({ error: true, message: "Email already in use" });
    // return;
  }

  const hashed = await hashPassword(password); // hash the password, so that we can store it in db

  const emailVerificationToken = generateRandomToken();
  const emailVerificationTokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ); // 24 hours from now

  // create and store a new user in the DB with email and hashed password
  const newUser = await createUser({
    email,
    username,
    role,
    password: hashed,
    state,
    emailVerificationToken,
    emailVerificationTokenExpiresAt,
    // authentication: { password: hashed },
  });

  // send the verification email to the user
  await sendVerificationEmail(email, emailVerificationToken);

  // ---------------- now no longer needed to send the token back to the client, as we are sending the email ----------------
  // // now generate jwt token, to be sent back to the client
  // const token = generateUserToken(newUser);

  // send the token back to the client
  res.status(201).json({
    message: "Registered successfully. Check email to verify your account.",
    error: false,
  });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: true, message: "Internal server error" });
  // }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // try {
  const { email, password } = req.body;

  //   const user = await getUserByEmail(email);
  // const user = await User.findOne({ email }).select("+authentication.password");

  // 1. Find user by email and include password
  const user = await User.findOne({ email }).select("+password"); // added select to include password in the response, so that we can compare it with the hashed password
  if (!user) {
    throw new AppError("User not found", 404);
    // res.status(404).json({ error: true, message: "User not found" });
    // return;
  }

  // 2. Check if verified
  if (!user?.isVerified) {
    throw new AppError("Please verify your email to login", 403);
  }

  // 3. Compare passwords and check if valid
  const isPasswordValid = await comparePassword(password, user?.password!);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
    // res.status(401).json({ message: "Invalid credentials" });
    // return;
  }

  // 4. Generate and return JWT
  const token = generateUserToken(user);

  res.status(200).json({ error: false, token });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: true, message: "Internal server error" });
  // }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req?.query?.token as string;
  // console.log("Verification email route hit");
  // console.log("🔥 token:", token);

  if (!token) {
    throw new AppError("Token is required", 400);
  }

  const user = await getUserByEmailVerificationToken(token);

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  // update the user's email verification token and email verification token expires at
  await updateUserById(user?._id, {
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationTokenExpiresAt: null,
  });

  res.status(200).json({
    message: "Email verified successfully",
    error: false,
  });
};
