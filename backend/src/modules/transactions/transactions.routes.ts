import { Router } from "express";

import * as transactionController from "./transaction.controller.js";

import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.post("/", authenticate, transactionController.createTransaction);

router.get("/", authenticate, transactionController.getTransactions);

router.get("/:id", authenticate, transactionController.getTransactionById);

router.put("/:id", authenticate, transactionController.updateTransaction);

router.delete("/:id", authenticate, transactionController.deleteTransaction);

export default router;
