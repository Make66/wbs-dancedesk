import { never, z } from "zod/v4";

export const courseDateSchema = z.object({
  date: z.date(),
  isStart: z.boolean().default(false),
});

export const courseSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  startsAt: z.date().default(new Date()),
  endsAt: z.date().default(new Date()),

  frequency: z.enum(["ongoing", "daily", "weekly", "biweekly", "monthly"]).default("weekly"),
  clubRepetition: z.int().min(1).max(50).default(50),
  courseRepetition: z.int().default(8),
  dates: z.array(courseDateSchema).default([]),
  paymentTypes: z.array(z.enum(["cash", "invoice", "paypal"])).default([]),
  contractTypes: z.array(z.enum(["standard", "trial"])).default([]),
  options: z.int("options must be a value between 0 and 12").default(0),
  seatsCurrent: z.number().default(0),
  seatsMax: z.number().default(0),

  isBookedOut: z.boolean().default(false),
  isClub: z.boolean().default(false),
  isIgnoreCalendar: z.boolean().default(false),
  isTaxFree: z.boolean().default(false),

  categoryId: z.uuid("Id given is not a valid UUID"),
  instructorId: z.uuid("Id given is not a valid UUID"),
  roomId: z.uuid("Id given is not a valid UUID"),
  textTermsId: z.uuid("Id given is not a valid UUID"),
  textInfoId: z.uuid("Id given is not a valid UUID"),

  id: z.uuid("Id given is not a valid UUID"),
  tenantId: z.uuid("Id given is not a valid UUID"),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

courseSchema.partial({
  description: true,
  instructorId: true,
  roomId: true,
  textTermsId: true,
  textInfoId: true,
  isActive: true,
  isDeleted: true,
  tenantId: true,
});

const options = [
  { key: 0, option: "default" },
  { key: 1, option: "geschlossen" },
  { key: 2, option: "nur für Herren" },
  { key: 3, option: "nur für Damen" },
  { key: 4, option: "nur für Herren Paare" },
  { key: 5, option: "nur für Damen Paare" },
  { key: 6, option: "nur für Paare" },
  { key: 7, option: "nur für Jungen" },
  { key: 8, option: "nur für Mädchen" },
  { key: 9, option: "nur für Jungen Paare" },
  { key: 10, option: "nur für Mädchen Paare" },
  { key: 11, option: "ohne Anmeldung vorbei kommen" },
  { key: 12, option: "nur Einzelanmeldung möglich" },
];
