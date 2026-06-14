export interface GetBudgetsDto {
  page: number;

  limit: number;

  categoryId?: string;

  budgetPeriod?: string;

  sortBy: "budgetPeriod" | "amount" | "createdAt";

  order: "asc" | "desc";
}