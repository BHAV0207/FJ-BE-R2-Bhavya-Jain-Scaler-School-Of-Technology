import { pool } from "../../database/pool.js";

export async function getSummary(userId: string) {
  const result = await pool.query(
    `
    SELECT

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type='income'
            THEN amount
          END
      ),0) as total_income,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type='expense'
            THEN amount
          END
      ),0) as total_expense,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type='refund'
            THEN amount
          END
      ),0) as total_refund

    FROM transactions

    WHERE user_id=$1
    `,
    [userId],
  );

  return result.rows[0];
}

export async function getCategoryWiseReport(userId: string) {
  const result = await pool.query(
    `
    SELECT

      c.name,

      SUM(t.amount) as total

    FROM transactions t

    JOIN categories c

    ON c.id=t.category_id

    WHERE

    t.user_id=$1

    AND

    t.transaction_type='expense'

    GROUP BY c.name

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
      ) as month,

      COALESCE(

      SUM(

      CASE

      WHEN transaction_type='income'

      THEN amount

      END

      ),0) as income,

      COALESCE(

      SUM(

      CASE

      WHEN transaction_type='expense'

      THEN amount

      END

      ),0) as expense,

      COALESCE(

      SUM(

      CASE

      WHEN transaction_type='refund'

      THEN amount

      END

      ),0) as refund

    FROM transactions

    WHERE user_id=$1

    GROUP BY month

    ORDER BY month DESC
    `,
    [userId],
  );

  return result.rows;
}
