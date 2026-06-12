// src/modules/user/user.repository.ts

import { pool } from "../../database/pool.js";
import type { CreateUserInput, User } from "./user.types.js";


function mapRowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


export async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    `
    SELECT
        id,
        name,
        email,
        password_hash,
        created_at,
        updated_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  if (result.rowCount === 0) {
    return null;
  }

  const row = result.rows[0];

  return mapRowToUser(row);
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const result = await pool.query(
    `
    INSERT INTO users
    (
        name,
        email,
        password_hash
    )

    VALUES
    (
        $1,
        $2,
        $3
    )

    RETURNING
        id,
        name,
        email,
        password_hash,
        created_at,
        updated_at
    `,
    [input.name, input.email, input.passwordHash],
  );

  const row = result.rows[0];

  return mapRowToUser(row);
}
