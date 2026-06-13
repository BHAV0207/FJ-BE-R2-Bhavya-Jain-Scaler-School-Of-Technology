import { pool } from "../../database/pool.js";

import type { CategoryEntity } from "./entity/category.entity.js";

export async function findById(id: string): Promise<CategoryEntity | null> {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      type,
      is_system,
      user_id,
      created_at
    FROM categories
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
    name: row.name,
    type: row.type,
    isSystem: row.is_system,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}
