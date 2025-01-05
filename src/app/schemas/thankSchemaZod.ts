import { z } from "zod";

const minNumOfChars = 50;
export const maxNumOfChars = 300;

export const thankSchema = z.object({ thank: z.string().min(minNumOfChars, `קצר מידי. נדרשים לפחות ${minNumOfChars} תווים`).max(maxNumOfChars, `ארוך מידי. ניתן עד ${maxNumOfChars} תווים`).nonempty("זהו שדה חובה") });