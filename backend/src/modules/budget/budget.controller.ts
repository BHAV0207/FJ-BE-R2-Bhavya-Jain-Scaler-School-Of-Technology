import type { Request, Response } from "express";
import * as budgetService from "./budget.service.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
  getBudgetsSchema,
} from "./budget.validation.js";
import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const dto = createBudgetSchema.parse(req.body);
  const response = await budgetService.createBudget(req.user!.id, dto);
  return res.status(201).json({
    success: true,
    data: response,
  });
});

export const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const dto = getBudgetsSchema.parse(req.query);
  const response = await budgetService.getBudgets(req.user!.id, dto);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const getBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const response = await budgetService.getBudgetById(
    req.user!.id,
    req.params.id as string,
  );
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const dto = updateBudgetSchema.parse(req.body);
  const response = await budgetService.updateBudget(
    req.user!.id,
    req.params.id as string,
    dto,
  );
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  await budgetService.deleteBudget(req.user!.id, req.params.id as string);
  return res.status(200).json({
    success: true,
    message: "Budget deleted successfully",
  });
});

export const getBudgetProgress = asyncHandler(async (req: Request, res: Response) => {
  const response = await budgetService.getBudgetProgress(req.user!.id);
  return res.status(200).json({
    success: true,
    data: response,
  });
});
