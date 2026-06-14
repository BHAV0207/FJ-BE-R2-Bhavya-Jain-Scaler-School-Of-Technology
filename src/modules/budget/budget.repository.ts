import { pool } from "../../database/pool.js";
import type { CreateBudgetDto } from "./dto/create-budget.dto.js";
import type { BudgetEntity } from "./entity/budget.entity.js";

export async function createBudget(
  userId: string,
  dto: CreateBudgetDto,
): Promise<BudgetEntity> {
  const result = await pool.query(
    `
    INSERT INTO budgets(
      user_id,
      category_id,
      amount,
      budget_period
    )

    VALUES($1,$2,$3,$4)

    RETURNING *
    `,
    [userId, dto.categoryId, dto.amount, dto.budgetPeriod],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    amount: row.amount,
    budgetPeriod: row.budget_period,
    createdAt: row.created_at,
  };
}


export async function findBudgets(
  userId: string,
  page: number,
  limit: number,
): Promise<{
  budgets: BudgetEntity[];
  total: number;
}> {
  const offset = (page - 1) * limit;

  const count = await pool.query(
    `
    SELECT COUNT(*)

    FROM budgets

    WHERE user_id=$1
    `,
    [userId],
  );

  const total = Number(
    count.rows[0].count,
  );

  const result = await pool.query(
    `
    SELECT *

    FROM budgets

    WHERE user_id=$1

    ORDER BY budget_period DESC

    LIMIT $2

    OFFSET $3
    `,
    [
      userId,
      limit,
      offset,
    ],
  );

  const budgets = result.rows.map(
    (row) => ({
      id: row.id,
      userId: row.user_id,
      categoryId: row.category_id,
      amount: row.amount,
      budgetPeriod: row.budget_period,
      createdAt: row.created_at,
    }),
  );

  return {
    budgets,
    total,
  };
}