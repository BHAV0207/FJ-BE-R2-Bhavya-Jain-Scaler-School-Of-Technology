// src/modules/auth/auth.controller.ts

import type{ Request, Response, NextFunction } from "express";

import * as authService from "./auth.service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {

    const response = await authService.register(
      req.body
    );

    res.status(201).json(response);

  } catch (error) {

    next(error);

  }

}