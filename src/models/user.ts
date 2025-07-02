import mongoose from "mongoose";
import { IUser, UserRoleEnum } from "../types";
import { INDIAN_STATES_AND_UTS } from "../constants";

export interface IUserType extends Document, IUser {
  // ------- can be used to add additional fields to the user here -------
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
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
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    document: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      enum: [UserRoleEnum.User, UserRoleEnum.Admin, UserRoleEnum.Manager],
      default: UserRoleEnum.User,
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
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiresAt: {
      type: Date,
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
