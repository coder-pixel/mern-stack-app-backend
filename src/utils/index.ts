import { IUser } from "../types";
import { generateToken } from "./auth";

export const generateUserToken = (user: IUser) => {
  return generateToken({
    id: user?._id,
    role: user?.role,
    email: user?.email,
    username: user?.username,
    state: user?.state,
    // can add more fields here, if needed, to be sent back to the client in the jwt token
  });
};
