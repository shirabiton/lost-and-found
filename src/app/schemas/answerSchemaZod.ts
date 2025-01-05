import { z } from 'zod';

export const answerSchema = z.object({ answers: z.array(z.string().min(1, "יש למלא את כל השדות")) });