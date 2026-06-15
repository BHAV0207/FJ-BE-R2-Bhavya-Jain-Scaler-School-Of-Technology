import { Pool } from "pg";
import { env } from "../config/env.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,

  // Maximum number of connections
  max: 10,

  // Close idle clients after 30 seconds
  idleTimeoutMillis: 30000,

  // Fail if a connection cannot be established within 2 seconds
  connectionTimeoutMillis: 2000,
});

// now we could have made a function to create a pool and export it so that we can use it in the other files
// but that would be a bit of a waste of time and resources as that would have cause creation of pool for every file that imports the pool
