import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("כתובת דוא״ל לא חוקית"),
  password: z.string().min(8, "הסיסמה חייבת להיות לפחות 8 תווים"),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, "השם המלא חייב להיות לפחות 2 תווים"),
  email: z.string().email("כתובת דוא״ל לא חוקית"),
  password: z
    .string()
    .min(8, "הסיסמה חייבת להיות לפחות 8 תווים")
    .regex(/[A-Z]/, "הסיסמה חייבת לכלול לפחות אות גדולה אחת")
    .regex(/[a-z]/, "הסיסמה חייבת לכלול לפחות אות קטנה אחת")
    .regex(/\d/, "הסיסמה חייבת לכלול לפחות מספר אחד"),
  phone: z
    .string()
    .regex(
      /^[0-9]{10,15}$/,
      "מספר הטלפון חייב להיות בין 10 ל-15 ספרות ולהכיל מספרים בלבד"
    ),
});



export const resetPasswordSchema = z.object({
  email: z.string().email("כתובת דוא״ל לא חוקית"),
});
