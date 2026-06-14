import { pool } from "../../database/pool.js";
import type { CategoryEntity } from "./entity/category.entity.js";

export function mapRowToCategory(row: any): CategoryEntity {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    isSystem: row.is_system,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

export async function findById(id: string): Promise<CategoryEntity | null> {
  const result = await pool.query(
    `
    SELECT id, name, type, is_system, user_id, created_at
    FROM categories
    WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) return null;
  return mapRowToCategory(result.rows[0]);
}

export async function findAllByUser(userId: string): Promise<CategoryEntity[]> {
  const result = await pool.query(
    `
    SELECT id, name, type, is_system, user_id, created_at
    FROM categories
    WHERE user_id = $1 OR is_system = TRUE
    ORDER BY name ASC
    `,
    [userId],
  );

  return result.rows.map(mapRowToCategory);
}

export async function createCategory(
  userId: string,
  data: { name: string; type: "income" | "expense" },
): Promise<CategoryEntity> {
  const result = await pool.query(
    `
    INSERT INTO categories (name, type, user_id, is_system)
    VALUES ($1, $2, $3, FALSE)
    RETURNING id, name, type, is_system, user_id, created_at
    `,
    [data.name, data.type, userId],
  );

  return mapRowToCategory(result.rows[0]);
}

export async function updateCategory(
  id: string,
  userId: string,
  data: { name?: string | undefined; type?: ("income" | "expense") | undefined },
): Promise<CategoryEntity | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (data.name) {
    updates.push(`name = $${index++}`);
    values.push(data.name);
  }

  if (data.type) {
    updates.push(`type = $${index++}`);
    values.push(data.type);
  }

  if (updates.length === 0) return null;

  values.push(id);
  values.push(userId);

  const result = await pool.query(
    `
    UPDATE categories
    SET ${updates.join(", ")}
    WHERE id = $${index} AND user_id = $${index + 1} AND is_system = FALSE
    RETURNING id, name, type, is_system, user_id, created_at
    `,
    values,
  );

  if (result.rows.length === 0) return null;
  return mapRowToCategory(result.rows[0]);
}

export async function deleteCategory(
  id: string,
  userId: string,
): Promise<boolean> {
  const result = await pool.query(
    `
    DELETE FROM categories
    WHERE id = $1 AND user_id = $2 AND is_system = FALSE
    `,
    [id, userId],
  );

  return (result.rowCount ?? 0) > 0;
}
