import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface TransactionEntity {
  id: string;

  userId: string;

  categoryId: string | null;

  amount: number;

  currency: SupportedCurrency;

  exchangeRate: number;

  baseAmount: number;

  transactionType: "income" | "expense" | "refund";

  description: string | null;

  transactionDate: Date;

  createdAt: Date;

  updatedAt: Date;
}