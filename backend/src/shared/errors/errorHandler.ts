import type { Request, Response, NextFunction } from "express";
import { AppError } from "./AppErrors.js";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle Database Errors (Postgres)
  // 23505 = Unique Violation
  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
      detail: err.detail,
    });
  }

  // Handle JWT errors etc if any...

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    reason: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}