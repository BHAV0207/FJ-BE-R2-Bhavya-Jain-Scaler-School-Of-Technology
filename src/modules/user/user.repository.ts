import { pool } from "../../database/pool.js";
import type { CreateUserDto } from "./dto/create-user.dto.js";
import type { UpdateUserDto } from "./dto/update-user.dto.js";
import type { User } from "./entity/user.entity.js";

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
        SELECT id, name, email, password_hash, created_at, updated_at
        FROM users
        WHERE email = $1
    `,
    [email],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRowToUser(result.rows[0]);
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const result = await pool.query(
    `
        INSERT INTO users
        ( name, email, password_hash )
        VALUES
        ( $1, $2, $3 )
        RETURNING id, name, email, password_hash, created_at, updated_at
    `,
    [dto.name, dto.email, dto.passwordHash],
  );

  return mapRowToUser(result.rows[0]);
}

export async function getById(id: string): Promise<User | null> {
  const result = await pool.query(
    `
      SELECT id,name,email,password_hash,created_at,updated_at
      FROM users 
      WHERE id = $1;
    `,
    [id],
  );
  return result.rowCount === 0 ? null : mapRowToUser(result.rows[0]);
}

export async function updateUser(
  id: string,
  dto: UpdateUserDto,
): Promise<User> {
  const updates: string[] = [];
  const values: unknown[] = [];

  let index = 1;

  if (dto.name !== undefined) {
    updates.push(`name=$${index++}`);
    values.push(dto.name);
  }

  if (dto.email !== undefined) {
    updates.push(`email=$${index++}`);
    values.push(dto.email);
  }

  values.push(id);

  const result = await pool.query(
    `
        UPDATE users
        SET
            ${updates.join(", ")},
            updated_at=NOW()
        WHERE id=$${index}
        RETURNING
            id,
            name,
            email,
            password_hash,
            created_at,
            updated_at
        `,
    values,
  );

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
