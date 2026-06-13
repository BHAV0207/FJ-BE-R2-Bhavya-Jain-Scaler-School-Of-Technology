import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppErrors.js";
import { env } from "../../config/env.js";



export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new AppError("Authentication required", 401)
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError("Invalid authorization header", 401)
    );
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_SECRET
    ) as {
      userId: string;
      email: string;
    };

    req.user = payload;

    next();

  } catch {

    next(
      new AppError("Invalid or expired token", 401)
    );

  }
}