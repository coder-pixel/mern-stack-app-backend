import mongoose from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  role: "user" | "admin";
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
}

const UserScehma = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false, // In Mongoose, setting select: false for a field in a schema means that this field will be excluded by default when querying documents from the database.
    },
    salt: {
      type: String,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
});

export const User = mongoose.model<IUser>("User", UserScehma);
