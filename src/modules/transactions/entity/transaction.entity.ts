export interface TransactionEntity {
  id: string;

  userId: string;

  categoryId: string | null;

  amount: number;

  currency: string;

  exchangeRate: number;

  baseAmount: number;

  transactionType: "income" | "expense" | "refund";

  description: string | null;

  transactionDate: Date;

  createdAt: Date;

  updatedAt: Date;
}