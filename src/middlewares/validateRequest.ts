import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { AppError } from "../utils/AppError";

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req?.body,
        query: req?.query,
        params: req?.params,
      });

      next();
    } catch (error: any) {
      console.log({ error });
      return res.status(400).json({
        error: true,
        message: error?.message || "Validation failed",
        issues: error?.errors,
      });

      throw new AppError(error?.message || "Validation failed", 400);
    }
  };
