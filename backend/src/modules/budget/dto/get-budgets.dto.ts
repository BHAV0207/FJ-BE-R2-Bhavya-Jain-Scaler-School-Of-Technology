export interface GetBudgetsDto {
  page: number;

  limit: number;

  categoryId?: string | undefined;

  budgetPeriod?: string | undefined;

  sortBy: "budgetPeriod" | "amount" | "createdAt";

  order: "asc" | "desc";
}