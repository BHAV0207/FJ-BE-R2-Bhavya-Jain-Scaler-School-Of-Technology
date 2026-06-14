import { Router } from "express";

import * as reportsController from "./reports.controller.js";

import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.get("/summary", authenticate, reportsController.getSummary);

router.get(
  "/category-wise",
  authenticate,
  reportsController.getCategoryWiseReport,
);

router.get("/monthly", authenticate, reportsController.getMonthlyReport);

export default router;
