import { z } from "zod";

export const userRegisterSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(3, { message: "Password must contain at least 3 characters" }),
    confirmPassword: z
      .string()
      .min(3, "Confirm password must also have at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
