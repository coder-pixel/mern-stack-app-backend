import mongoose from "mongoose";
import { IUser } from "../types";
import { INDIAN_STATES_AND_UTS } from "../constants";
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
    state: {
      type: String,
      required: false,
      enum: INDIAN_STATES_AND_UTS,
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
