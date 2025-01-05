import { z } from "zod";

export const LostItemSchema = z.object({
  subCategoryId: z
    .string()
    .nonempty("יש לבחור תת-קטגוריה"),
  colorId: z
    .string()
    .nonempty("יש לבחור צבע"),
  selectedLocation: z
    .union([z.literal("map"), z.literal("transport"), z.null()])
    .refine((value) => value !== null, {
      message: "יש לבחור מיקום",
    }),
  circles: z
    .array(
      z.object({
        center: z.object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
        }),
        radius: z.number().positive(),
      })
    )
    .optional()
    .refine((circles) => circles === undefined || circles.length > 0, {
      message: "יש לסמן לפחות מעגל אחד במפה",
    }),
  publicTransport: z
    .object({
      typePublicTransportId: z
        .string()
        .refine(value => value !== "", {
          message: "יש למלא את כל השדות",
        }),
      city: z
        .string()
        .refine(value => value !== "", {
          message: "יש למלא את כל השדות",
        }),
      line: z
        .string()
        .refine(value => value !== "", {
          message: "יש למלא את כל השדות",
        }),
    })
    .optional()
});