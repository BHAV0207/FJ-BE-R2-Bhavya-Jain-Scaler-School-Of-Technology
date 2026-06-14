import { pool } from "../../database/pool.js";

import type { BudgetEntity } from "./entity/budget.entity.js";

import type { CreateBudgetDto } from "./dto/create-budget.dto.js";
import type { UpdateBudgetDto } from "./dto/update-budget.dto.js";
import type { GetBudgetsDto } from "./dto/get-budgets.dto.js";

export async function createBudget(
  userId: string,
  dto: CreateBudgetDto,
): Promise<BudgetEntity> {
  const result = await pool.query(
    `
    INSERT INTO budgets (
      user_id,
      category_id,
      amount,
      budget_period
    )
    VALUES (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING
      id,
      user_id,
      category_id,
      amount,
      budget_period,
      created_at
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
  dto: GetBudgetsDto,
): Promise<{
  budgets: BudgetEntity[];
  total: number;
}> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  conditions.push("user_id = $1");
  values.push(userId);

  let parameterIndex = 2;

  if (dto.categoryId) {
    conditions.push(`category_id = $${parameterIndex}`);

    values.push(dto.categoryId);

    parameterIndex++;
  }

  if (dto.budgetPeriod) {
    conditions.push(`budget_period = $${parameterIndex}`);

    values.push(dto.budgetPeriod);

    parameterIndex++;
  }

  const whereClause = conditions.join(" AND ");

  const sortColumnMap = {
    budgetPeriod: "budget_period",
    amount: "amount",
    createdAt: "created_at",
  };

  const orderBy = sortColumnMap[dto.sortBy];

  const order = dto.order === "asc" ? "ASC" : "DESC";

  const countResult = await pool.query(
    `
    SELECT COUNT(*)

    FROM budgets

    WHERE ${whereClause}
    `,
    values,
  );

  const total = Number(countResult.rows[0].count);

  const offset = (dto.page - 1) * dto.limit;

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
      budget_period,
      created_at

    FROM budgets

    WHERE ${whereClause}

    ORDER BY ${orderBy} ${order}

    LIMIT $${limitIndex}

    OFFSET $${offsetIndex}
    `,
    values,
  );

  const budgets: BudgetEntity[] = result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    amount: row.amount,
    budgetPeriod: row.budget_period,
    createdAt: row.created_at,
  }));

  return {
    budgets,
    total,
  };
}

export async function findBudgetById(id: string): Promise<BudgetEntity | null> {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      category_id,
      amount,
      budget_period,
      created_at

    FROM budgets

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
    budgetPeriod: row.budget_period,
    createdAt: row.created_at,
  };
}

export async function findBudgetByUserCategoryAndPeriod(
  userId: string,
  categoryId: string,
  budgetPeriod: string,
): Promise<BudgetEntity | null> {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      category_id,
      amount,
      budget_period,
      created_at

    FROM budgets

    WHERE
      user_id = $1
      AND category_id = $2
      AND budget_period = $3
    `,
    [userId, categoryId, budgetPeriod],
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
    budgetPeriod: row.budget_period,
    createdAt: row.created_at,
  };
}

export async function updateBudget(
  budgetId: string,
  dto: UpdateBudgetDto,
): Promise<BudgetEntity> {
  const updates: string[] = [];
  const values: unknown[] = [];

  let parameterIndex = 1;

  if (dto.categoryId !== undefined) {
    updates.push(`category_id = $${parameterIndex++}`);

    values.push(dto.categoryId);
  }

  if (dto.amount !== undefined) {
    updates.push(`amount = $${parameterIndex++}`);

    values.push(dto.amount);
  }

  if (dto.budgetPeriod !== undefined) {
    updates.push(`budget_period = $${parameterIndex++}`);

    values.push(dto.budgetPeriod);
  }

  values.push(budgetId);

  const result = await pool.query(
    `
    UPDATE budgets

    SET
      ${updates.join(", ")}

    WHERE id = $${parameterIndex}

    RETURNING
      id,
      user_id,
      category_id,
      amount,
      budget_period,
      created_at
    `,
    values,
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

export async function deleteBudget(budgetId: string): Promise<void> {
  await pool.query(
    `
    DELETE FROM budgets

    WHERE id = $1
    `,
    [budgetId],
  );
}

export async function getBudgetProgress(userId: string) {
  const result = await pool.query(
    `
    SELECT

      b.id,

      c.id as category_id,

      c.name as category_name,

      b.amount as budget,

      COALESCE(
        SUM(t.amount),
        0
      ) as spent

    FROM budgets b

    JOIN categories c

      ON c.id=b.category_id

    LEFT JOIN transactions t

      ON t.category_id=b.category_id

      AND t.user_id=b.user_id

      AND t.transaction_type='expense'

      AND DATE_TRUNC('month',t.transaction_date)
      =
      DATE_TRUNC('month',b.budget_period)

    WHERE b.user_id=$1

    GROUP BY
      b.id,
      c.id,
      c.name,
      b.amount

    ORDER BY c.name
    `,
    [userId],
  );

  return result.rows;
}

export async function markNotificationSent(budgetId: string): Promise<void> {
  await pool.query(
    `
    UPDATE budgets

    SET

    notification_sent = TRUE

    WHERE id = $1
    `,
    [budgetId],
  );
}

export async function getAllBudgetProgress() {
  const result = await pool.query(
    `
    SELECT

      b.id AS budget_id,

      b.user_id,

      b.notification_sent,

      c.name AS category_name,

      b.amount AS budget,

      COALESCE(
        SUM(t.amount),
        0
      ) AS spent

    FROM budgets b

    JOIN categories c

      ON c.id = b.category_id

    LEFT JOIN transactions t

      ON t.category_id = b.category_id

      AND t.user_id = b.user_id

      AND t.transaction_type = 'expense'

      AND DATE_TRUNC('month', t.transaction_date)
          =
          DATE_TRUNC('month', b.budget_period)

    GROUP BY
      b.id,
      b.user_id,
      b.notification_sent,
      c.name,
      b.amount
    `,
  );

  return result.rows;
}
