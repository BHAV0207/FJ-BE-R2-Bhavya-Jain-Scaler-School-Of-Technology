import { Router } from "express";

import * as dashboardController from "./dashboard.controller.js";

import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.get("/", authenticate, dashboardController.getDashboard);

export default router;
