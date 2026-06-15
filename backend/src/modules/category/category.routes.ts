import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { authenticate } from "../../shared/security/auth.middleware.js";

const router = Router();

router.get("/", authenticate, categoryController.getAllCategories);
router.post("/", authenticate, categoryController.createCategory);
router.get("/:id", authenticate, categoryController.getCategoryById);
router.patch("/:id", authenticate, categoryController.updateCategory);
router.delete("/:id", authenticate, categoryController.deleteCategory);

export default router;
