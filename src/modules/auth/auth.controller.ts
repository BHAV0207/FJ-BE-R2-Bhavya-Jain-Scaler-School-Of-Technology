// src/modules/auth/auth.controller.ts

import type { Request, Response, NextFunction } from "express";

import * as authService from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

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
