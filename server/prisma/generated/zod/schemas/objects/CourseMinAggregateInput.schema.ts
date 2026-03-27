import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.literal(true).optional(),
  categoryId: z.literal(true).optional(),
  seq: z.literal(true).optional(),
  active: z.literal(true).optional(),
  startsAt: z.literal(true).optional(),
  endsAt: z.literal(true).optional(),
  repeat: z.literal(true).optional(),
  frequency: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  isIgnoreCalendar: z.literal(true).optional(),
  seatsCurrent: z.literal(true).optional(),
  seatsMax: z.literal(true).optional(),
  instructorId: z.literal(true).optional(),
  textTermsId: z.literal(true).optional(),
  textInfoId: z.literal(true).optional(),
  id: z.literal(true).optional(),
  tenantId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  isDeleted: z.literal(true).optional(),
  textId: z.literal(true).optional()
}).strict();
export const CourseMinAggregateInputObjectSchema: z.ZodType<Prisma.CourseMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CourseMinAggregateInputType>;
export const CourseMinAggregateInputObjectZodSchema = makeSchema();
