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
    provider: row.provider,
    googleId: row.google_id,
    preferredCurrency: row.preferred_currency,
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
      provider,
      google_id,
      preferred_currency,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return mapRowToUser(row);
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const result = await pool.query(
    `
    INSERT INTO users (
      name,
      email,
      password_hash,
      provider,
      google_id,
      preferred_currency
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    )
    RETURNING
      id,
      name,
      email,
      password_hash,
      provider,
      google_id,
      preferred_currency,
      created_at,
      updated_at
    `,
    [
      dto.name,
      dto.email,
      dto.passwordHash,
      dto.provider ?? "local",
      dto.googleId ?? null,
      dto.preferredCurrency ?? "INR",
    ],
  );

  const row = result.rows[0];

  return mapRowToUser(row);
}

export async function getById(id: string): Promise<User | null> {
  const result = await pool.query(
    `
      SELECT id, name, email, password_hash, provider, google_id, preferred_currency, created_at, updated_at
      FROM users 
      WHERE id = $1;
    `,
    [id],
  );
  return result.rowCount === 0 ? null : mapRowToUser(result.rows[0]);
}

export async function updateUser(
  userId: string,
  dto: UpdateUserDto,
): Promise<User> {
  const updates: string[] = [];
  const values: unknown[] = [];

  let index = 1;

  if (dto.name !== undefined) {
    updates.push(`name = $${index++}`);
    values.push(dto.name);
  }

  if (dto.preferredCurrency !== undefined) {
    updates.push(`preferred_currency = $${index++}`);
    values.push(dto.preferredCurrency);
  }

  updates.push(`updated_at = NOW()`);

  values.push(userId);

  const result = await pool.query(
    `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING
      id,
      name,
      email,
      password_hash,
      provider,
      google_id,
      preferred_currency,
      created_at,
      updated_at
    `,
    values,
  );

  const row = result.rows[0];

  return mapRowToUser(row);
}

export async function findByGoogleId(googleId: string): Promise<User | null> {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      password_hash,
      provider,
      google_id,
      created_at,
      updated_at
    FROM users
    WHERE google_id = $1
    `,
    [googleId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return mapRowToUser(row);
}

export async function linkGoogleAccount(
  userId: string,
  googleId: string,
): Promise<void> {
  await pool.query(
    `
    UPDATE users

    SET

      provider='google',

      google_id=$1,

      updated_at=NOW()

    WHERE id=$2
    `,
    [googleId, userId],
  );
}
