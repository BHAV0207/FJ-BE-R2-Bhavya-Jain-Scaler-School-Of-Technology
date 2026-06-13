import { pool } from "../../database/pool.js";
import type { CreateTransactionDto } from "./dto/create-transaction.dto.js";

import type { TransactionEntity } from "./entity/transaction.entity.js";

export async function createTransaction(
  userId: string,
  dto: CreateTransactionDto,
): Promise<TransactionEntity> {
  const result = await pool.query(
    `
    INSERT INTO transactions (
      user_id,
      category_id,
      amount,
      transaction_type,
      currency,
      description,
      transaction_date
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
    )
    RETURNING
      id,
      user_id,
      category_id,
      amount,
      transaction_type,
      currency,
      description,
      transaction_date,
      created_at,
      updated_at
    `,
    [
      userId,
      dto.categoryId,
      dto.amount,
      dto.transactionType,
      dto.currency,
      dto.description ?? null,
      dto.transactionDate,
    ],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    amount: row.amount,
    transactionType: row.transaction_type,
    currency: row.currency,
    description: row.description,
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
