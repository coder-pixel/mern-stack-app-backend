import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { JWT_SECRET } from "../config";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const checkAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req?.headers?.authorization;
  console.log("🔥 authHeader:", authHeader);

  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  // if token is present, extract it
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  // verify the token
  const decoded = jwt.verify(token, JWT_SECRET!) as IUser;

  if (!decoded) {
    throw new AppError("Unauthorized", 401);
  }

  console.log("🔥 decoded:", decoded);

  req.user = decoded;

  next();
};
