import * as z from "zod";

export const strongPasswordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const signUpFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: strongPasswordSchema,
});

export const signInFormSchema = z.object({
  email: z.email(),
  password: strongPasswordSchema,
});
