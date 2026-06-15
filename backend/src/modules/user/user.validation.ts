import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "../../shared/currency/currencies.js";

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).optional(),

    email: z
      .string()
      .email()
      .transform((email) => email.toLowerCase())
      .optional(),
      
    preferredCurrency: z.enum(SUPPORTED_CURRENCIES).optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined || data.preferredCurrency !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
