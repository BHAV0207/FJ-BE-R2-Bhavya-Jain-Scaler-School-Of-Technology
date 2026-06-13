export interface GetTransactionsDto {
  page: number;

  limit: number;

  transactionType?: "income" | "expense" | "refund";

  categoryId?: string;

  startDate?: string;

  endDate?: string;

  sortBy: "transactionDate" | "amount" | "createdAt";

  order: "asc" | "desc";
}