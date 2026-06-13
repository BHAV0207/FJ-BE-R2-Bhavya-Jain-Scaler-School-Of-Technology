import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).optional(),

    email: z
      .string()
      .email()
      .transform((email) => email.toLowerCase())
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
