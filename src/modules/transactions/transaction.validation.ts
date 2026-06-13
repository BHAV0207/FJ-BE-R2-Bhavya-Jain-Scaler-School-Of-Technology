import { z } from "zod";

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid(),

  amount: z.number().positive("Amount must be greater than zero"),

  transactionType: z.enum(["income", "expense", "refund"]),

  currency: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase()),

  description: z.string().trim().max(500).optional(),

  transactionDate: z.string().date(),
});

export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>;
