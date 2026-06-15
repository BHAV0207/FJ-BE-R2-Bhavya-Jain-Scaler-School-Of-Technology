import { pool } from "../../database/pool.js";

export async function getSummary(userId: string) {
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

export async function getCategoryWiseReport(userId: string) {
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

export async function getMonthlyReport(userId: string) {
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
      ) AS expense,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type = 'refund'
            THEN base_amount
          END
        ),
        0
      ) AS refund

    FROM transactions

    WHERE user_id = $1

    GROUP BY month

    ORDER BY month DESC
    `,
    [userId],
  );

  return result.rows;
}
