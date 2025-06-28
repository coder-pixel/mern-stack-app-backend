import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("🔥 Global Error Handler:", err);

  // const status = err?.status || 500;
  // const message = err?.message || "Internal Server Error from middleware";

  const status = err instanceof AppError ? err?.statusCode : 500; // err?.statusCode -> added for AppError class in utils/AppError.ts
  const message =
    err instanceof AppError ? err?.message : "Something went wrong";

  res.status(status).json({
    error: true,
    message,
  });
};
