import type { Request, Response, NextFunction } from "express";

import * as reportsService from "./reports.service.js";

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await reportsService.getSummary(req.user!.id);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCategoryWiseReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await reportsService.getCategoryWiseReport(
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

export async function getMonthlyReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await reportsService.getMonthlyReport(req.user!.id);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}
