import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./shared/errors/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

//health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

export default app;
