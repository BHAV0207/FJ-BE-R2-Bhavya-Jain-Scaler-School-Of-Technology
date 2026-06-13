import { AppError } from "../../shared/errors/AppErrors.js";

import * as categoryRepository from "../category/category.repository.js";
import * as transactionRepository from "./transaction.repository.js";

import type { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import type { TransactionResponseDto } from "./dto/tranasction-response.dto.js";

export async function createTransaction(
  userId: string,
  dto: CreateTransactionDto,
): Promise<TransactionResponseDto> {
  // Check category exists
  const category = await categoryRepository.findById(dto.categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Check ownership
  if (!category.isSystem && category.userId !== userId) {
    throw new AppError("You are not allowed to use this category", 403);
  }

  // Check category type
  if (
    dto.transactionType !== "refund" &&
    category.type !== dto.transactionType
  ) {
    throw new AppError("Category type does not match transaction type", 400);
  }

  // Create transaction
  const transaction = await transactionRepository.createTransaction(
    userId,
    dto,
  );

  return {
    id: transaction.id,
    categoryId: transaction.categoryId,
    amount: transaction.amount,
    transactionType: transaction.transactionType,
    currency: transaction.currency,
    description: transaction.description,
    transactionDate: transaction.transactionDate,
  };
}
