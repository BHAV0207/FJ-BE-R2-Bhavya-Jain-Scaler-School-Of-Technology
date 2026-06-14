import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as dashboardService from "./dashboard.service.js";

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response =
      await dashboardService.getDashboard(
        req.user!.id,
      );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}