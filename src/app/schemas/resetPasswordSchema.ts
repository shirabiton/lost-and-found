import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "הסיסמה חייבת להיות לפחות 8 תווים.")
      .regex(/[A-Z]/, "הסיסמה חייבת לכלול לפחות אות אחת גדולה.")
      .regex(/[a-z]/, "הסיסמה חייבת לכלול לפחות אות אחת קטנה.")
      .regex(/\d/, "הסיסמה חייבת לכלול לפחות ספרה אחת."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "הסיסמאות אינן תואמות.",
    path: ["confirmPassword"],
  });
