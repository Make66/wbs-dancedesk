import { z } from 'zod/v4';

export const courseDateSchema = z.object({
  date: z.date(),
  isStart: z.boolean().default(false)
});

export const courseSchema = z.object({
  name: z.string().min(1),
  active: z.boolean().default(true),
  startsAt: z.date().default(new Date()),
  endsAt: z.date().default(new Date()),
  repeat: z.number().min(1).max(50).optional(),
  frequency: z.enum(['ongoing', 'daily', 'weekly', 'bi-weekly', 'monthly']).optional(),
  isIgnoreCalendar: z.boolean().default(false),
  dates: z.array(courseDateSchema).default([]),
  seatsCurrent: z.number().default(0),
  seatsMax: z.number().default(0),
  paymentTypes: z.array(z.enum(['cash', 'invoice', 'paypal'])).default([]),
  contractTypes: z.array(z.enum(['standard', 'trial'])).default([]),
  
  category: z.uuid(),
  instructor: z.uuid().optional(),
  room: z.uuid().optional(),
  textTerms: z.uuid().optional(),
  textInfo: z.uuid().optional(),

  id: z.uuid(),
  tenantId: z.uuid(),
  isDeleted: z.boolean().default(false)
});

courseSchema.partial({
  name: true,
  active: true,
  startsAt: true,
  endsAt: true,
  repeat: true,
  frequency: true,
  isIgnoreCalendar: true,
  dates: true,
  seatsCurrent: true,
  seatsMax: true,
  paymentTypes: true,
  contractTypes: true,

  category: true,
  instructor: true,
  room: true,
  textTerms: true,
  textInfo: true,

  isDeleted: true
});
