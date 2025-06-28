import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("🔥 Global Error Handler:", err);

  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error from middleware";

  res.status(status).json({
    error: true,
    message,
  });
};
