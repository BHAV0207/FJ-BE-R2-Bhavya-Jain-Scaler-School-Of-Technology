import { AppError } from "../../shared/errors/AppErrors.js";

import * as categoryRepository from "../category/category.repository.js";
import * as transactionRepository from "./transaction.repository.js";

import type { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import type { GetTransactionsResponseDto } from "./dto/get-tranasction-response.dto.js";
import type { GetTransactionsDto } from "./dto/get-transactions.dto.js";
import type { TransactionResponseDto } from "./dto/transaction-response.dto.js";
import type { UpdateTransactionDto } from "./dto/update-transaction.dto.js";

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

export async function getTransactions(
  userId: string,
  dto: GetTransactionsDto,
): Promise<GetTransactionsResponseDto> {
  const {
    transactions,
    total,
  } = await transactionRepository.findTransactions(
    userId,
    dto,
  );

  return {
    transactions: transactions.map((transaction) => ({
      id: transaction.id,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      currency: transaction.currency,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
    })),

    page: dto.page,

    limit: dto.limit,

    total,

    totalPages: Math.ceil(
      total / dto.limit,
    ),
  };
}

export async function getTransactionById(
  userId: string,
  transactionId: string,
): Promise<TransactionResponseDto> {
  const transaction =
    await transactionRepository.findTransactionById(
      transactionId,
    );

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

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


export async function deleteTransaction(
  userId: string,
  transactionId: string,
): Promise<void> {
  const transaction =
    await transactionRepository.findTransactionById(
      transactionId,
    );

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await transactionRepository.deleteTransaction(
    transactionId,
  );
}


export async function updateTransaction(
  userId: string,
  transactionId: string,
  dto: UpdateTransactionDto,
): Promise<TransactionResponseDto> {
  const existingTransaction =
    await transactionRepository.findTransactionById(
      transactionId,
    );

  if (!existingTransaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (existingTransaction.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  if (dto.categoryId) {
    const category = await categoryRepository.findById(
      dto.categoryId,
    );

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (
      !category.isSystem &&
      category.userId !== userId
    ) {
      throw new AppError(
        "You are not allowed to use this category",
        403,
      );
    }

    if (
      dto.transactionType &&
      dto.transactionType !== "refund" &&
      category.type !== dto.transactionType
    ) {
      throw new AppError(
        "Category type does not match transaction type",
        400,
      );
    }
  }

  const updatedTransaction =
    await transactionRepository.updateTransaction(
      transactionId,
      dto,
    );

  return {
    id: updatedTransaction.id,
    categoryId: updatedTransaction.categoryId,
    amount: updatedTransaction.amount,
    transactionType: updatedTransaction.transactionType,
    currency: updatedTransaction.currency,
    description: updatedTransaction.description,
    transactionDate: updatedTransaction.transactionDate,
  };
}