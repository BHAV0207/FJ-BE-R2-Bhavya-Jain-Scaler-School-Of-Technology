import { pool } from "./pool.js";

export async function initializeDatabase(): Promise<void> {
  try {
    // Verify that PostgreSQL is reachable
    const result = await pool.query("SELECT version();");

    console.log("✅ Database connected successfully");
    console.log(`📦 ${result.rows[0].version}`);
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL");

    throw error;
    // HERE we are not exiting becaus the role of this is to initialise the database and if something fails it passes it to the 
    //server , whihc decides what to do with it , should we exit or not 
  }
}   