import { AppError } from "../../shared/errors/AppErrors.js";

import * as budgetRepository from "./budget.repository.js";
import * as categoryRepository from "../category/category.repository.js";
import * as userRepository from "../user/user.repository.js";
import { convertToBaseCurrency, convertFromBaseCurrency } from "../../shared/currency/currency.service.js";
import type { SupportedCurrency } from "../../shared/currency/currencies.js";

import type { CreateBudgetDto } from "./dto/create-budget.dto.js";
import type { UpdateBudgetDto } from "./dto/update-budget.dto.js";

import type { BudgetResponseDto } from "./dto/budget-response.dto.js";
import type { GetBudgetsDto } from "./dto/get-budgets.dto.js";
import type { GetBudgetsResponseDto } from "./dto/get-budgets-response.dto.js";
import type { BudgetProgressDto } from "./dto/budget-progress.dto.js";

export async function createBudget(
  userId: string,
  dto: CreateBudgetDto,
): Promise<BudgetResponseDto> {
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Convert amount from preferred currency to base currency before saving
  const { baseAmount } = convertToBaseCurrency(
    dto.amount,
    user.preferredCurrency as SupportedCurrency
  );
  dto.amount = baseAmount;

  const category = await categoryRepository.findById(dto.categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (!category.isSystem && category.userId !== userId) {
    throw new AppError("You are not allowed to use this category", 403);
  }

  if (category.type !== "expense") {
    throw new AppError(
      "Budget can only be created for expense categories",
      400,
    );
  }

  const existingBudget =
    await budgetRepository.findBudgetByUserCategoryAndPeriod(
      userId,
      dto.categoryId,
      dto.budgetPeriod,
    );

  if (existingBudget) {
    throw new AppError(
      "Budget already exists for this category and period",
      409,
    );
  }

  const budgetResponse = await budgetRepository.createBudget(userId, dto);

  return {
    id: budgetResponse.id,
    categoryId: budgetResponse.categoryId,
    amount: convertFromBaseCurrency(
      Number(budgetResponse.amount),
      user.preferredCurrency as SupportedCurrency
    ).toFixed(2),
    budgetPeriod: budgetResponse.budgetPeriod,
  };
}

export async function getBudgets(
  userId: string,
  dto: GetBudgetsDto,
): Promise<GetBudgetsResponseDto> {
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { budgets, total } = await budgetRepository.findBudgets(userId, dto);

  const convertedBudgets = budgets.map((budget) => ({
    id: budget.id,
    categoryId: budget.categoryId,
    amount: convertFromBaseCurrency(
      Number(budget.amount),
      user.preferredCurrency as SupportedCurrency
    ).toFixed(2),
    budgetPeriod: budget.budgetPeriod,
  }));

  return {
    budgets: convertedBudgets,
    page: dto.page,
    limit: dto.limit,
    total,
    totalPages: Math.ceil(total / dto.limit),
  };
}

export async function getBudgetById(
  userId: string,
  budgetId: string,
): Promise<BudgetResponseDto> {
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const budget = await budgetRepository.findBudgetById(budgetId);

  if (!budget) {
    throw new AppError("Budget not found", 404);
  }

  if (budget.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return {
    id: budget.id,
    categoryId: budget.categoryId,
    amount: convertFromBaseCurrency(
      Number(budget.amount),
      user.preferredCurrency as SupportedCurrency
    ).toFixed(2),
    budgetPeriod: budget.budgetPeriod,
  };
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  dto: UpdateBudgetDto,
): Promise<BudgetResponseDto> {
  const existingBudget = await budgetRepository.findBudgetById(budgetId);

  if (!existingBudget) {
    throw new AppError("Budget not found", 404);
  }

  if (existingBudget.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const categoryId = dto.categoryId ?? existingBudget.categoryId;

  const budgetPeriod =
    dto.budgetPeriod ?? existingBudget.budgetPeriod.toISOString().split("T")[0];

  if (!budgetPeriod) {
    throw new AppError("Budget period is required", 400);
  }

  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (!category.isSystem && category.userId !== userId) {
    throw new AppError("Forbidden category", 403);
  }

  if (category.type !== "expense") {
    throw new AppError(
      "Budget can only be created for expense categories",
      400,
    );
  }

  const duplicate = await budgetRepository.findBudgetByUserCategoryAndPeriod(
    userId,
    categoryId,
    budgetPeriod,
  );

  if (duplicate && duplicate.id !== budgetId) {
    throw new AppError(
      "Budget already exists for this category and period",
      409,
    );
  }

  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (dto.amount !== undefined) {
    const { baseAmount } = convertToBaseCurrency(
      dto.amount,
      user.preferredCurrency as SupportedCurrency
    );
    dto.amount = baseAmount;
  }

  const updated = await budgetRepository.updateBudget(budgetId, dto);

  return {
    id: updated.id,
    categoryId: updated.categoryId,
    amount: convertFromBaseCurrency(
      Number(updated.amount),
      user.preferredCurrency as SupportedCurrency
    ).toFixed(2),
    budgetPeriod: updated.budgetPeriod,
  };
}

export async function deleteBudget(
  userId: string,
  budgetId: string,
): Promise<void> {
  const budget = await budgetRepository.findBudgetById(budgetId);

  if (!budget) {
    throw new AppError("Budget not found", 404);
  }

  if (budget.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await budgetRepository.deleteBudget(budgetId);
}

export async function getBudgetProgress(
  userId: string,
): Promise<BudgetProgressDto[]> {
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const rows = await budgetRepository.getBudgetProgress(userId);

  return rows.map((row) => {
    const budgetBase = Number(row.budget);
    const spentBase = Number(row.spent);

    // Convert from base currency to preferred currency
    const budget = convertFromBaseCurrency(
      budgetBase,
      user.preferredCurrency as SupportedCurrency
    );
    const spent = convertFromBaseCurrency(
      spentBase,
      user.preferredCurrency as SupportedCurrency
    );
    const remaining = budget - spent;

    return {
      id: row.id,
      categoryId: row.category_id,
      categoryName: row.category_name,
      amount: budget.toFixed(2),
      budgetPeriod: row.budget_period,
      spent: spent.toFixed(2),
      remaining: remaining.toFixed(2),
      percentageUsed:
        budget === 0 ? 0 : Number(((spent / budget) * 100).toFixed(2)),
      isOverBudget: spent > budget,
      notificationSent: row.notification_sent,
    };
  });
}
