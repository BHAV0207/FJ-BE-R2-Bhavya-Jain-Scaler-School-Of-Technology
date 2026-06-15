import type { Request, Response } from "express";
import * as reportsService from "./reports.service.js";
import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const response = await reportsService.getSummary(req.user!.id);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const getCategoryWiseReport = asyncHandler(async (req: Request, res: Response) => {
  const response = await reportsService.getCategoryWiseReport(req.user!.id);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const getMonthlyReport = asyncHandler(async (req: Request, res: Response) => {
  const response = await reportsService.getMonthlyReport(req.user!.id);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const getFullReport = asyncHandler(async (req: Request, res: Response) => {
  const response = await reportsService.getFullReport(req.user!.id);
  return res.status(200).json({
    success: true,
    data: response,
  });
});
