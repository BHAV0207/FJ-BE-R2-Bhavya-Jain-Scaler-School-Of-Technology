import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface UpdateTransactionDto {
  categoryId?: string | undefined;

  amount?: number | undefined;

  currency?: SupportedCurrency | undefined;

  transactionType?: "income" | "expense" | "refund" | undefined;

  description?: string | undefined;

  transactionDate?: string | undefined;
}
