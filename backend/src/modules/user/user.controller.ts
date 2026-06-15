import type { NextFunction , Request , Response } from "express";
import * as userService from "./user.service.js";
import { updateUserSchema } from "./user.validation.js";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await userService.getProfile(
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto = updateUserSchema.parse(req.body);

    const response = await userService.updateProfile(
      req.user!.id,
      dto,
    );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}