export interface UpdateTransactionRepositoryDto {
  categoryId?: string | undefined;

  amount?: number | undefined;

  currency?: string | undefined;

  exchangeRate?: number | undefined;

  baseAmount?: number | undefined;

  transactionType?: "income" | "expense" | "refund" | undefined;

  description?: string | undefined;

  transactionDate?: string | undefined;
}