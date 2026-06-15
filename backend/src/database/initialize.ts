import fs from "fs/promises";
import path from "path";
import { pool } from "./pool.js";

export async function initializeDatabase(): Promise<void> {
  try {
    // Verify that PostgreSQL is reachable
    const result = await pool.query("SELECT version();");

    console.log("✅ Database connected successfully");
    console.log(`📦 ${result.rows[0].version}`);

    // Create migrations log table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations_log (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Run migrations
    const migrationsDir = path.join(process.cwd(), "migrations");
    const files = await fs.readdir(migrationsDir);
    // Remove leading/trailing spaces from filenames for consistency
    const sqlFiles = files
      .filter((f) => f.endsWith(".sql"))
      .sort((a, b) => a.trim().localeCompare(b.trim()));

    console.log(`🔍 Checking ${sqlFiles.length} migrations...`);

    for (const file of sqlFiles) {
      const trimmedFile = file.trim();
      const checkResult = await pool.query(
        "SELECT id FROM migrations_log WHERE filename = $1",
        [trimmedFile],
      );

      if (checkResult.rows.length > 0) {
        continue; // Skip already executed migrations
      }

      console.log(`  📄 Executing ${trimmedFile}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, "utf-8");

      try {
        await pool.query(sql);
        await pool.query(
          "INSERT INTO migrations_log (filename) VALUES ($1)",
          [trimmedFile],
        );
      } catch (err: any) {
        console.error(`❌ Error executing ${trimmedFile}:`, err.message);
        throw err;
      }
    }

    console.log("🙌 All pending migrations executed successfully");
  } catch (error: any) {
    console.error("❌ Failed to initialize database:", error.message);

    throw error;
  }
}