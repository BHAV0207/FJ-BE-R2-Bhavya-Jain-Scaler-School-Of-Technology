export interface GetTransactionsDto {
  page: number;

  limit: number;

  transactionType?: "income" | "expense" | "refund" | undefined;

  categoryId?: string | undefined;

  startDate?: string | undefined;

  endDate?: string | undefined;

  sortBy: "transactionDate" | "amount" | "createdAt";

  order: "asc" | "desc";
}