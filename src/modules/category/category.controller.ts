import type { NextFunction, Request, Response } from "express";
import * as categoryService from "./category.service.js";
import { createCategorySchema, updateCategorySchema } from "./category.validation.js";
import { AppError } from "../../shared/errors/AppErrors.js";

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any).userId;
    const categories = await categoryService.getAllCategories(userId);
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any).userId;
    const data = createCategorySchema.parse(req.body);
    const category = await categoryService.createCategory(userId, data);
    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any).userId;
    const id = req.params.id as string;
    const data = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(id, userId, data);
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any).userId;
    const id = req.params.id as string;
    await categoryService.deleteCategory(id, userId);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    if (!id) throw new AppError("Category ID is required", 400);
    const category = await categoryService.getCategoryById(id);
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}
