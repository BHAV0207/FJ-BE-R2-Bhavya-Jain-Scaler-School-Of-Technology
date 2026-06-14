// src/modules/auth/auth.controller.ts

import type { Request, Response, NextFunction } from "express";

import * as authService from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import type { User } from "../user/entity/user.entity.js";
import { GenerateAccessToken } from "../../shared/security/token.service.js";
import { env } from "../../config/env.js";


export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto = registerSchema.parse(req.body);
    const response = await authService.register(dto);
    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = loginSchema.parse(req.body);
    const response = await authService.login(dto);
    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user as User;

    const accessToken = GenerateAccessToken(user.id);

    return res.redirect(
      `${env.FRONTEND_URL}/oauth-success?token=${accessToken}`,
    );
  } catch (error) {
    return next(error);
  }
}
