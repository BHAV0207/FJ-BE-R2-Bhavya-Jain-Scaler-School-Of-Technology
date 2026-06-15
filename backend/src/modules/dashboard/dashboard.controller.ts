import type { Request, Response } from "express";
import * as dashboardService from "./dashboard.service.js";
import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const response = await dashboardService.getDashboard(req.user!.id);

  return res.status(200).json({
    success: true,
    data: response,
  });
});