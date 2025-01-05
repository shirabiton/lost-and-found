import { z } from "zod";

export const emailSchema = z.object({
    name: z.string().min(2, "קצר מידי").nonempty("שדה חובה"),
    email: z.string().email("אימייל לא תקין").nonempty("שדה חובה"),
    content: z.string().min(20, "נדרשים לפחות 20 תווים לתוכן ההודעה").nonempty("שדה חובה")
});
