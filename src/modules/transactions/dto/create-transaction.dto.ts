import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface CreateTransactionDto {
  categoryId: string;

  amount: number;

  currency: SupportedCurrency;

  transactionType: "income" | "expense" | "refund";

  description?: string | undefined;

  transactionDate: string;
}
