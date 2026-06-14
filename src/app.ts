import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./shared/errors/errorHandler.js";
import userRoutes from "./modules/user/user.routes.js";
import transactionRoutes from "./modules/transactions/transactions.routes.js";
import budgetRoutes from "./modules/budget/budget.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);

//health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

export default app;
