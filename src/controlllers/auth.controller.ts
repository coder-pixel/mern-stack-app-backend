import { Request, Response } from "express";
import { User } from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";
import {
  createUser,
  getUserByEmail,
  getUserByVerificationTokenType,
  updateUserById,
} from "../services/user.service";
import { AppError } from "../utils/AppError";
import { generateUserToken } from "../utils";
import { generateRandomToken } from "../utils/token";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email";
import {
  EMAIL_VERIFICATION_EXPIRATION_TIME,
  RESET_PASSWORD_EXPIRATION_TIME,
} from "../config";

export const register = async (req: Request, res: Response): Promise<void> => {
  // try {
  const { email, password, username, role, state, name } = req.body;

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
    Date.now() + EMAIL_VERIFICATION_EXPIRATION_TIME
  ); // 24 hours from now

  // create and store a new user in the DB with email and hashed password
  const newUser = await createUser({
    email,
    username,
    role,
    name,
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

  // 1. Check if token is provided
  if (!token) {
    throw new AppError("Token is required", 400);
  }

  // 2. Check if user exists and token is valid and not expired
  const user = await getUserByVerificationTokenType(
    "emailVerificationToken",
    "emailVerificationTokenExpiresAt",
    token
  );

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  // 3. Update the user's email verification token and email verification token expires at
  await updateUserById(user?._id, {
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationTokenExpiresAt: null,
  });

  // 4. Send success response
  res.status(200).json({
    message: "Email verified successfully",
    error: false,
  });
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  // 1. Check if email is provided
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  // 2. Check if user exists
  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 3. Check if user is verified
  if (user?.isVerified) {
    throw new AppError("User already verified", 400);
  }

  // 4. Generate new verification token and expiration date
  const generatedToken = generateRandomToken();
  const emailVerificationTokenExpiresAt = new Date(
    Date.now() + EMAIL_VERIFICATION_EXPIRATION_TIME
  ); // 24 hours from now

  // 5. Update user with new verification token and expiration date
  await updateUserById(user?._id, {
    emailVerificationToken: generatedToken,
    emailVerificationTokenExpiresAt,
  });

  // 6. Send verification email
  await sendVerificationEmail(email, generatedToken);

  res.status(200).json({
    message: "Verification email resent successfully",
    error: false,
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req?.body;

  // 1. Check if token and password are provided
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  // 2. Check if user exists
  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 3. Generate new reset password token and expiration date
  const generatedToken = generateRandomToken();
  const resetPasswordTokenExpiresAt = new Date(
    Date.now() + RESET_PASSWORD_EXPIRATION_TIME
  );

  // 4. Update user with new reset password token and expiration date
  await updateUserById(user?._id, {
    resetPasswordToken: generatedToken,
    resetPasswordTokenExpiresAt,
  });

  // 5. Send reset password email
  await sendPasswordResetEmail(email, generatedToken);

  res.status(200).json({
    message: "Reset password email sent successfully",
    error: false,
  });
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, password } = req?.body;

  // 1. Check if token and password are provided
  if (!token || !password) {
    throw new AppError("Missing token or password", 400);
  }

  // 2. Check if user exists and token is valid and not expired
  const user = await getUserByVerificationTokenType(
    "resetPasswordToken",
    "resetPasswordTokenExpiresAt",
    token
  );

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  // 3. Check if password is provided
  if (!password) {
    throw new AppError("Password is required", 400);
  }

  // 4. Hash the password
  const hashedPassword = await hashPassword(password);

  // 5. Update user with new password
  await updateUserById(user?._id, {
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordTokenExpiresAt: null,
  });

  // 6. Send success response
  res.status(200).json({
    message: "Password reset successfully",
    error: false,
  });
};
