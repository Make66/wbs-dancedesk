import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional(),
  repeat: z.literal(true).optional(),
  seatsCurrent: z.literal(true).optional(),
  seatsMax: z.literal(true).optional()
}).strict();
export const CourseAvgAggregateInputObjectSchema: z.ZodType<Prisma.CourseAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CourseAvgAggregateInputType>;
export const CourseAvgAggregateInputObjectZodSchema = makeSchema();
