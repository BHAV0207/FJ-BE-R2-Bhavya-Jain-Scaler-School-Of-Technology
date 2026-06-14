import { Router } from "express";

import * as receiptController from "./receipt.controller.js";

import { upload } from "./multer.js";
import { authenticate } from "../../../shared/security/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("receipt"),
  receiptController.uploadReceipt,
);

router.get("/:transactionId", authenticate, receiptController.getReceipt);

router.delete("/:id", authenticate, receiptController.deleteReceipt);

export default router;
