export interface TransactionResponseDto {
  id: string;

  categoryId: string | null;

  amount: string;

  transactionType: "income" | "expense" | "refund";

  currency: string;

  description: string | null;

  transactionDate: Date;
}