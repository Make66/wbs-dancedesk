import { z } from "zod/v4";

export const courseDateSchema = z.object({
  date: z.coerce.date(),
  isStart: z.boolean().default(false),
});

export const courseSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  startsAt: z.coerce.date().default(new Date()).optional(),
  endsAt: z.coerce.date().default(new Date()),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).default('weekly').optional(),
  clubRepetition: z.int().min(1).max(50).default(50).optional(),
  courseRepetition: z.int().default(8).optional(),
  dates: z.array(courseDateSchema).default([]).optional(),
  paymentTypes: z.array(z.enum(['cash', 'invoice', 'paypal'])).default([]).optional(),
  contractTypes: z.array(z.enum(['standard', 'trial'])).default([]).optional(),
  options: z.int('options must be a value between 0 and 12').default(0).optional(),
  seatsCurrent: z.number().optional(),
  seatsMax: z.number().optional(),

  isBookedOut: z.boolean().optional(),
  isClub: z.boolean().optional(),
  isIgnoreCalendar: z.boolean().optional(),
  isTaxFree: z.boolean().optional(),

  categoryId: z.uuid('Id given is not a valid UUID').optional(),
  instructorId: z.uuid('Id given is not a valid UUID').optional(),
  roomId: z.uuid('Id given is not a valid UUID').optional(),
  textTermsId: z.uuid('Id given is not a valid UUID').optional(),
  textInfoId: z.uuid('Id given is not a valid UUID').optional(),

  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const courseOptions = [
  { key: 0, option: 'default' },
  { key: 1, option: 'geschlossen' },
  { key: 2, option: 'nur für Herren' },
  { key: 3, option: 'nur für Damen' },
  { key: 4, option: 'nur für Herren Paare' },
  { key: 5, option: 'nur für Damen Paare' },
  { key: 6, option: 'nur für Paare' },
  { key: 7, option: 'nur für Jungen' },
  { key: 8, option: 'nur für Mädchen' },
  { key: 9, option: 'nur für Jungen Paare' },
  { key: 10, option: 'nur für Mädchen Paare' },
  { key: 11, option: 'ohne Anmeldung vorbei kommen' },
  { key: 12, option: 'nur Einzelanmeldung möglich' },
];
