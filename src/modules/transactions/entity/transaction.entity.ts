export interface TransactionEntity {
  id: string;

  userId: string;

  categoryId: string | null;

  amount: string;

  transactionType: "income" | "expense" | "refund";

  currency: string;

  description: string | null;

  transactionDate: Date;

  createdAt: Date;

  updatedAt: Date;
}