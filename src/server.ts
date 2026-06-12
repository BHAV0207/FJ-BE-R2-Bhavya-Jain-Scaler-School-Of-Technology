import app from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./database/initialize.js";

async function bootstrap() {
  try {
    await initializeDatabase();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Application failed to start.");

    process.exit(1);
  }
}

bootstrap();