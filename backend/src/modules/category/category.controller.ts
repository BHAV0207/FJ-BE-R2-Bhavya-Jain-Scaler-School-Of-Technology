import type { Request, Response } from "express";
import * as categoryService from "./category.service.js";
import { createCategorySchema, updateCategorySchema } from "./category.validation.js";
import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const categories = await categoryService.getAllCategories(userId);
  return res.status(200).json({
    success: true,
    data: categories,
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const data = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(userId, data);
  return res.status(201).json({
    success: true,
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const id = req.params.id as string;
  const data = updateCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(id, userId, data);
  return res.status(200).json({
    success: true,
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const id = req.params.id as string;
  await categoryService.deleteCategory(id, userId);
  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await categoryService.getCategoryById(id);
  return res.status(200).json({
    success: true,
    data: category,
  });
});
