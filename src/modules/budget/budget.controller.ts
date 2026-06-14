import type { NextFunction, Request, Response } from "express";

import * as budgetService from "./budget.service.js";

import {
  createBudgetSchema,
  updateBudgetSchema,
  getBudgetsSchema,
} from "./budget.validation.js";

export async function createBudget(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto = createBudgetSchema.parse(req.body);

    const response = await budgetService.createBudget(req.user.userId, dto);

    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getBudgets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto = getBudgetsSchema.parse(req.query);

    const response = await budgetService.getBudgets(req.user.userId, dto);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getBudgetById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await budgetService.getBudgetById(
      req.user.userId,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateBudget(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto = updateBudgetSchema.parse(req.body);

    const response = await budgetService.updateBudget(
      req.user.userId,
      req.params.id,
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

export async function deleteBudget(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await budgetService.deleteBudget(req.user.userId, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}

export async function getBudgetProgress(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await budgetService.getBudgetProgress(req.user.userId);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}
