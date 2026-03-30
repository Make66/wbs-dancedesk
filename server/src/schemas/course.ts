import { start } from 'repl';
import { z } from 'zod/v4';

const uuidSchema = z.string().uuid();

export const setSeqCourseSchema = z.object({
  parent: uuidSchema,
  course: z.array(uuidSchema),
});

export const courseDateSchema = z.object({
  date: z.date(),
  isStart: z.boolean().default(false)
});

export const courseSchema = z.object({
  name: z.string().min(1),
  category: z.uuid(),
  seq: z.number().default(0),
  active: z.boolean().default(true),

  startsAt: z.date().default(new Date()),
  endsAt: z.date().default(new Date()),
  repeat: z.number().min(1).max(50).optional(),
  frequency: z.enum(['ongoing', 'daily', 'weekly', 'bi-weekly', 'monthly']).optional(),
  room: z.uuid().optional(),
  isIgnoreCalendar: z.boolean().default(false),
  dates: z.array(courseDateSchema).default([]),
  seatsCurrent: z.number().default(0),
  seatsMax: z.number().default(0),
  paymentTypes: z.array(z.enum(['cash', 'invoice', 'paypal'])).default([]),
  contractTypes: z.array(z.enum(['standard', 'trial'])).default([]),
  instructor: z.uuid().optional(),
  textTerms: z.uuid().optional(),
  textInfo: z.uuid().optional(),
});
