import { pool } from "../../database/pool.js";

import type { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import type { GetTransactionsDto } from "./dto/get-transactions.dto.js";
import type { UpdateTransactionDto } from "./dto/update-transaction.dto.js";

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
      $1,$2,$3,$4,$5,$6,$7
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

export async function findTransactions(
  userId: string,
  dto: GetTransactionsDto,
): Promise<{
  transactions: TransactionEntity[];
  total: number;
}> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  conditions.push(`user_id = $1`);
  values.push(userId);

  let parameterIndex = 2;

  if (dto.transactionType) {
    conditions.push(`transaction_type = $${parameterIndex}`);

    values.push(dto.transactionType);

    parameterIndex++;
  }

  if (dto.categoryId) {
    conditions.push(`category_id = $${parameterIndex}`);

    values.push(dto.categoryId);

    parameterIndex++;
  }

  if (dto.startDate) {
    conditions.push(`transaction_date >= $${parameterIndex}`);

    values.push(dto.startDate);

    parameterIndex++;
  }

  if (dto.endDate) {
    conditions.push(`transaction_date <= $${parameterIndex}`);

    values.push(dto.endDate);

    parameterIndex++;
  }

  const whereClause = conditions.join(" AND ");

  const sortColumnMap = {
    transactionDate: "transaction_date",
    amount: "amount",
    createdAt: "created_at",
  };

  const orderBy = sortColumnMap[dto.sortBy];

  const order = dto.order === "asc" ? "ASC" : "DESC";

  const offset = (dto.page - 1) * dto.limit;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as count

      FROM transactions

      WHERE ${whereClause}
    `,
    values,
  );

  const total = Number(countResult.rows[0].count);

  values.push(dto.limit);
  values.push(offset);

  const limitIndex = parameterIndex;
  const offsetIndex = parameterIndex + 1;

  const result = await pool.query(
    `
      SELECT
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

      FROM transactions

      WHERE ${whereClause}

      ORDER BY ${orderBy} ${order}

      LIMIT $${limitIndex}

      OFFSET $${offsetIndex}
    `,
    values,
  );

  const transactions: TransactionEntity[] = result.rows.map((row) => ({
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
  }));

  return {
    transactions,
    total,
  };
}


export async function findTransactionById(
  id: string,
): Promise<TransactionEntity | null> {
  const result = await pool.query(
    `
    SELECT
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
    FROM transactions
    WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

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

export async function deleteTransaction(
  id: string,
): Promise<void> {
  await pool.query(
    `
    DELETE FROM transactions
    WHERE id = $1
    `,
    [id],
  );
}


export async function updateTransaction(
  id: string,
  dto: UpdateTransactionDto,
): Promise<TransactionEntity> {
  const updates: string[] = [];
  const values: unknown[] = [];

  let index = 1;

  if (dto.categoryId !== undefined) {
    updates.push(`category_id=$${index++}`);
    values.push(dto.categoryId);
  }

  if (dto.amount !== undefined) {
    updates.push(`amount=$${index++}`);
    values.push(dto.amount);
  }

  if (dto.transactionType !== undefined) {
    updates.push(`transaction_type=$${index++}`);
    values.push(dto.transactionType);
  }

  if (dto.currency !== undefined) {
    updates.push(`currency=$${index++}`);
    values.push(dto.currency);
  }

  if (dto.description !== undefined) {
    updates.push(`description=$${index++}`);
    values.push(dto.description);
  }

  if (dto.transactionDate !== undefined) {
    updates.push(`transaction_date=$${index++}`);
    values.push(dto.transactionDate);
  }

  updates.push(`updated_at=NOW()`);

  values.push(id);

  const result = await pool.query(
    `
    UPDATE transactions
    SET ${updates.join(", ")}

    WHERE id=$${index}

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
    values,
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