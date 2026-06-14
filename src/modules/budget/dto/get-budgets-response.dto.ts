import type { BudgetResponseDto } from "./budget-response.dto.js";

export interface GetBudgetsResponseDto {
  budgets: BudgetResponseDto[];

  page: number;

  limit: number;

  total: number;

  totalPages: number;
}