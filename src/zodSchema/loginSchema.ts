import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(3, "password must be alteast 3 characters"),
});
