import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2 , "name must be at least 2 characters long"),
  email : z.email("Invalid email address").transform((value) => value.toLowerCase()),
  password : z.string().min(8 , "Password must be 8 characters long") ,
})

export type RegisterRequest = z.infer<typeof registerSchema>;