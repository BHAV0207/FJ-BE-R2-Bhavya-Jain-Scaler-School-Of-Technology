import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppErrors.js";
import { VerifyAccessToken } from "./token.service.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Authentication required", 401));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization header", 401));
  }

  try {
    const payload = VerifyAccessToken(token);

    (req as any).user = {
      id: payload.userId,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
