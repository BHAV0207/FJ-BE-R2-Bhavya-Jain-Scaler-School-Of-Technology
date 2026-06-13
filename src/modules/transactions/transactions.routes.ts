import { Router } from "express";

import * as transactionController from "./transaction.controller.js";

import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  transactionController.createTransaction,
);

router.get(
  "/",
  authenticate,
  transactionController.getTransactions,
);

export default router;