import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2 , "name must be at least 2 characters long"),
  email: z.string().email().transform(email => email.toLowerCase()),
  password : z.string().min(8 , "Password must be 8 characters long") ,
})

export const loginSchema = z.object({
  email: z.string().email().transform(email => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
})

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;