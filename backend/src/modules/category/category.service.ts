import * as categoryRepository from "./category.repository.js";
import { AppError } from "../../shared/errors/AppErrors.js";

export async function getAllCategories(userId: string) {
  return await categoryRepository.findAllByUser(userId);
}

export async function createCategory(userId: string, data: { name: string; type: "income" | "expense" }) {
  const existing = await categoryRepository.findByName(userId, data.name, data.type);
  if (existing) {
    throw new AppError(`Category "${data.name}" already exists for this type`, 409);
  }
  return await categoryRepository.createCategory(userId, data);
}

export async function updateCategory(id: string, userId: string, data: { name?: string | undefined; type?: "income" | "expense" | undefined }) {
  const category = await categoryRepository.updateCategory(id, userId, data);
  if (!category) {
    throw new AppError("Category not found or you don't have permission to update it", 404);
  }
  return category;
}

export async function deleteCategory(id: string, userId: string) {
  const success = await categoryRepository.deleteCategory(id, userId);
  if (!success) {
    throw new AppError("Category not found or you don't have permission to delete it", 404);
  }
  return { success: true };
}

export async function getCategoryById(id: string) {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
}
