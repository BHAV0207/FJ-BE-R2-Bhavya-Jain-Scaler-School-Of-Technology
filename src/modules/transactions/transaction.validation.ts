import { z } from "zod";

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid(),

  amount: z
    .number()
    .positive("Amount must be greater than zero"),

  transactionType: z.enum([
    "income",
    "expense",
    "refund",
  ]),

  currency: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  transactionDate: z.string().date(),
});

export const getTransactionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  transactionType: z
    .enum(["income", "expense", "refund"])
    .optional(),

  categoryId: z.string().uuid().optional(),

  startDate: z.string().date().optional(),

  endDate: z.string().date().optional(),

  sortBy: z
    .enum([
      "transactionDate",
      "amount",
      "createdAt",
    ])
    .default("transactionDate"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type CreateTransactionRequest =
  z.infer<typeof createTransactionSchema>;

export type GetTransactionsRequest =
  z.infer<typeof getTransactionsSchema>;