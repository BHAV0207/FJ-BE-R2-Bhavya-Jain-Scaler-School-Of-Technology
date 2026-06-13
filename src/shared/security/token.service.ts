import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppErrors.js";

export const VerifyAccessToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    return { userId: decoded.userId };
  } catch{
    throw new AppError("Invalid token", 401);
  }
};

export const GenerateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "1d" });
};
