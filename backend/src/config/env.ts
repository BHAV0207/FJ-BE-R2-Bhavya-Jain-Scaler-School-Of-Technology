// src/config/env.ts

import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env
dotenv.config();

/**
 * Schema describing every required environment variable.
 * This becomes the single source of truth for configuration.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string(),

  GOOGLE_CLIENT_SECRET: z.string(),

  GOOGLE_CALLBACK_URL: z.string(),

  FRONTEND_URL: z.string(),

  SENDGRID_API_KEY: z.string().min(1),

  EMAIL_FROM: z.string().email(),
});

/**
 * Validate environment variables at application startup.
 * If validation fails, the application should not start.
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsedEnv.error.format());

  process.exit(1);
}

/**
 * Export a fully validated and typed configuration object.
 * The rest of the application should import this instead
 * of accessing process.env directly.
 */
export const env = parsedEnv.data;
