import { Router } from "express";

import * as userController from "./user.controller.js";
import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  userController.getProfile
);

router.put(
  "/me",
  authenticate,
  userController.updateProfile,
);

export default router;