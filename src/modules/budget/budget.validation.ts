import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid(),

  amount: z.number().positive(),

  budgetPeriod: z.string().date(),
});

export const updateBudgetSchema = z
  .object({
    categoryId: z.string().uuid().optional(),

    amount: z.number().positive().optional(),

    budgetPeriod: z.string().date().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field is required",
    },
  );

export const getBudgetsSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),
});