export interface CreateTransactionRepositoryDto {
  categoryId: string;

  amount: number;

  currency: string;

  exchangeRate: number;

  baseAmount: number;

  transactionType: "income" | "expense" | "refund";

  description?: string;

  transactionDate: string;
}