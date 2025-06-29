import mongoose from "mongoose";
import { IUser } from "../types";

export interface IUserType extends Document, IUser {
  // ------- can be used to add additional fields to the user here -------
  // authentication: {
  //   password: string;
  //   salt: string;
  //   sessionToken: string;
  // };
}

const UserScehma = new mongoose.Schema<IUserType>(
  {
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
    password: {
      type: String,
      required: true,
      select: false,
    },
    location: {
      type: String,
      required: false,
    },
    // authentication: {
    //   password: {
    //     type: String,
    //     required: true,
    //     select: false, // In Mongoose, setting select: false for a field in a schema means that this field will be excluded by default when querying documents from the database.
    //   },
    //   salt: {
    //     type: String,
    //     select: false,
    //   },
    //   sessionToken: {
    //     type: String,
    //     select: false,
    //   },
    // },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserType>("User", UserScehma);
