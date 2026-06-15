import type { TransactionResponseDto } from "./transaction-response.dto.js";

export interface GetTransactionsResponseDto {
  transactions: TransactionResponseDto[];

  page: number;

  limit: number;

  total: number;

  totalPages: number;
}