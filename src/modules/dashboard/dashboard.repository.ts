import { pool } from "../../database/pool.js";

export async function getDashboardSummary(userId: string) {
  const result = await pool.query(
    `
    SELECT

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type = 'income'
            THEN base_amount
          END
        ),
        0
      ) AS total_income,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type = 'expense'
            THEN base_amount
          END
        ),
        0
      ) AS total_expense,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type = 'refund'
            THEN base_amount
          END
        ),
        0
      ) AS total_refund

    FROM transactions

    WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows[0];
}

export async function getMonthlyBudget(userId: string) {
  const result = await pool.query(
    `
    SELECT

      COALESCE(
        SUM(amount),
        0
      ) AS monthly_budget

    FROM budgets

    WHERE
      user_id = $1

      AND DATE_TRUNC(
        'month',
        budget_period
      ) = DATE_TRUNC(
        'month',
        CURRENT_DATE
      )
    `,
    [userId],
  );

  return result.rows[0];
}

export async function getCurrentMonthExpense(userId: string) {
  const result = await pool.query(
    `
    SELECT

      COALESCE(
        SUM(base_amount),
        0
      ) AS budget_used

    FROM transactions

    WHERE
      user_id = $1

      AND transaction_type = 'expense'

      AND DATE_TRUNC(
        'month',
        transaction_date
      ) = DATE_TRUNC(
        'month',
        CURRENT_DATE
      )
    `,
    [userId],
  );

  return result.rows[0];
}

export async function getRecentTransactions(userId: string) {
  const result = await pool.query(
    `
    SELECT

      id,

      amount,

      currency,

      exchange_rate,

      base_amount,

      transaction_type,

      description,

      transaction_date

    FROM transactions

    WHERE user_id = $1

    ORDER BY created_at DESC

    LIMIT 5
    `,
    [userId],
  );

  return result.rows;
}

export async function getExpenseByCategory(userId: string) {
  const result = await pool.query(
    `
    SELECT

      c.id,

      c.name,

      COALESCE(
        SUM(t.base_amount),
        0
      ) AS total

    FROM transactions t

    LEFT JOIN categories c

      ON c.id = t.category_id

    WHERE

      t.user_id = $1

      AND t.transaction_type = 'expense'

    GROUP BY

      c.id,

      c.name

    ORDER BY total DESC
    `,
    [userId],
  );

  return result.rows;
}

export async function getMonthlyTrend(userId: string) {
  const result = await pool.query(
    `
    SELECT

      TO_CHAR(
        transaction_date,
        'YYYY-MM'
      ) AS month,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type = 'income'
            THEN base_amount
          END
        ),
        0
      ) AS income,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type = 'expense'
            THEN base_amount
          END
        ),
        0
      ) AS expense

    FROM transactions

    WHERE user_id = $1

    GROUP BY month

    ORDER BY month
    `,
    [userId],
  );

  return result.rows;
}
