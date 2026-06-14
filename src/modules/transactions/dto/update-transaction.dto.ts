import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface UpdateTransactionDto {
  categoryId?: string;

  amount?: number;

  currency?: SupportedCurrency;

  transactionType?: "income" | "expense" | "refund";

  description?: string;

  transactionDate?: string;
}
