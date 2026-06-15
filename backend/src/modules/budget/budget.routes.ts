import { Router } from "express";

import * as budgetController from "./budget.controller.js";

import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.post("/", authenticate, budgetController.createBudget);

router.get("/progress", authenticate, budgetController.getBudgetProgress);

router.get("/", authenticate, budgetController.getBudgets);

router.get("/:id", authenticate, budgetController.getBudgetById);

router.put("/:id", authenticate, budgetController.updateBudget);

router.delete("/:id", authenticate, budgetController.deleteBudget);

export default router;
