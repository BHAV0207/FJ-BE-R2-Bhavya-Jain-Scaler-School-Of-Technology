import app from "./app";
import { env } from "./config/env";
import { initializeDatabase } from "./database/initialize";

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