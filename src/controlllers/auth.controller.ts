import { Request, Response } from "express";
import { User } from "../models/users";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";
import { createUser, getUserByEmail } from "../services/user.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !username || !password) {
      res
        .status(400)
        .json({ error: true, message: "Some required fields are missing" });
      return;
    }

    // check for existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: true, message: "Email already in use" });
      return;
    }

    const hashed = await hashPassword(password); // hash the password, so that we can store it in db

    // create and store a new user in the DB with email and hashed password
    const newUser = await createUser({
      email,
      username,
      authentication: { password: hashed },
    });

    // now generate jwt token, to be sent back to the client
    const token = generateToken({ id: newUser?._id, role: newUser?.role });

    // send the token back to the client
    res
      .status(201)
      .json({ token, message: "User created successfully", error: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    //   const user = await getUserByEmail(email);
    const user = await User.findOne({ email }).select(
      "+authentication.password"
    );
    if (!user) {
      res.status(404).json({ error: true, message: "User not found" });
      return;
    }

    const isPasswordValid = await comparePassword(
      password,
      user?.authentication?.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken({ id: user?._id, role: user?.role });

    res.status(200).json({ error: false, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
