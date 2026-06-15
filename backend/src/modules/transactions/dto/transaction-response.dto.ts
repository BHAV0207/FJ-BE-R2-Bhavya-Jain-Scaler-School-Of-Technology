import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface TransactionResponseDto {
  id: string;

  categoryId: string | null;

  amount: number;

  transactionType: "income" | "expense" | "refund";

  currency: SupportedCurrency;

  description: string | null;
  
  categoryName?: string;

  transactionDate: Date;
}
