import { z } from "zod/v4";

export const courseFormSchema = z
  .object({
    name: z.string().trim().min(1, "Bitte einen Kursnamen eingeben"),
    description: z.string().trim().optional(),
    categoryId: z.string().optional(),
    contracts: z.array(z.any()).optional(),
    startsAt: z.date().optional(),
    endsAt: z.date().optional(),
    frequency: z.string(),
    isClub: z.boolean().default(false).optional(),
    courseRepetition: z.number().min(1, "Es muss mindestens 1 Wiederholung eingegeben werden"),
    clubRepetition: z.number().min(1, "Es muss mindestens 1 Wiederholung eingegeben werden"),
    isIgnoreCalendar: z.boolean().default(false).optional(),
    dates: z.array(z.any()).optional(),
    isTaxFree: z.boolean().default(false).optional(),
    isBookedOut: z.boolean().default(false).optional(),
    color: z.tuple([z.string(), z.string()]).optional(),
    seatsMax: z.number(),
    seatsCurrent: z.number().optional(),
    instructorId: z.string().optional(),
    roomId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.startsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startsAt"],
        message: "Bitte ein Datum und eine Startzeit wählen",
      });
    }

    if (!values.endsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "Bitte eine Endzeit wählen",
      });
    }

    if (values.startsAt && values.endsAt && values.endsAt <= values.startsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "Die Endzeit muss nach der Startzeit liegen",
      });
    }

    if (values.seatsCurrent && values.seatsCurrent > values.seatsMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["seatsCurrent"],
        message: "Belegte Plätze dürfen nicht größer als maximale Plätze sein",
      });
    }
  });

export type CourseFormValues = z.infer<typeof courseFormSchema>;
