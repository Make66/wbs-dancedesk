import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Bitte einen Titel eingeben")
      .max(120, "Der Titel darf maximal 120 Zeichen lang sein"),

    description: z
      .string()
      .trim()
      .max(1000, "Die Beschreibung darf maximal 1000 Zeichen lang sein")
      .optional()
      .or(z.literal("")),

    imageUrl: z.string().trim().optional().or(z.literal("")),

    color: z.tuple([z.string(), z.string()]),

    type: z.string().trim().optional().or(z.literal("")),

    street: z.string().trim().optional().or(z.literal("")),
    city: z.string().trim().optional().or(z.literal("")),
    zipCode: z.string().trim().optional().or(z.literal("")),

    longitude: z.number().optional(),
    latitude: z.number().optional(),

    startsAt: z.date().optional(),
    endsAt: z.date().optional(),

    roomId: z.string().optional(),
  })
  .refine((data) => !!data.startsAt, {
    message: "Bitte ein Startdatum wählen",
    path: ["startsAt"],
  })
  .refine((data) => !!data.endsAt, {
    message: "Bitte ein Enddatum wählen",
    path: ["endsAt"],
  })
  .refine(
    (data) => {
      if (!data.startsAt || !data.endsAt) return true;
      return data.endsAt > data.startsAt;
    },
    {
      message: "Das Enddatum muss nach dem Startdatum liegen",
      path: ["endsAt"],
    },
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;
