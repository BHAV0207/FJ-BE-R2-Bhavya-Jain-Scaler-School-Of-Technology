import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import type { User } from "../user/entity/user.entity.js";
import { GenerateAccessToken } from "../../shared/security/token.service.js";
import { env } from "../../config/env.js";
import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const dto = registerSchema.parse(req.body);
  const response = await authService.register(dto);
  return res.status(201).json({
    success: true,
    data: response,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const dto = loginSchema.parse(req.body);
  const response = await authService.login(dto);
  return res.status(201).json({
    success: true,
    data: response,
  });
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const accessToken = GenerateAccessToken(user.id);
  return res.redirect(
    `${env.FRONTEND_URL}/oauth-success?token=${accessToken}`,
  );
});
