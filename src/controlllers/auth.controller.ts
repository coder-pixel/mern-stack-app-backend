import { Request, Response } from "express";
import { User } from "../models/user";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";
import { createUser, getUserByEmail } from "../services/user.service";
import { AppError } from "../utils/AppError";

export const register = async (req: Request, res: Response): Promise<void> => {
  // try {
  const { email, password, username, role } = req.body;

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

  // create and store a new user in the DB with email and hashed password
  const newUser = await createUser({
    email,
    username,
    role,
    password: hashed,
    // authentication: { password: hashed },
  });

  // now generate jwt token, to be sent back to the client
  const token = generateToken({
    id: newUser?._id,
    role: newUser?.role,
    email: newUser?.email,
    username: newUser?.username,
  });

  // send the token back to the client
  res
    .status(201)
    .json({ token, message: "User created successfully", error: false });
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
  const user = await User.findOne({ email }).select("+password"); // added select to include password in the response, so that we can compare it with the hashed password
  if (!user) {
    throw new AppError("User not found", 404);
    // res.status(404).json({ error: true, message: "User not found" });
    // return;
  }

  const isPasswordValid = await comparePassword(password, user?.password!);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
    // res.status(401).json({ message: "Invalid credentials" });
    // return;
  }

  const token = generateToken({
    id: user?._id,
    role: user?.role,
    email: user?.email,
    username: user?.username,
    // can add more fields here, if needed, to be sent back to the client in the jwt token
  });

  res.status(200).json({ error: false, token });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: true, message: "Internal server error" });
  // }
};
