export interface CreateTransactionDto {
  categoryId: string;

  amount: number;

  transactionType: "income" | "expense" | "refund";

  currency: string;

  description?: string;

  transactionDate: string;
}