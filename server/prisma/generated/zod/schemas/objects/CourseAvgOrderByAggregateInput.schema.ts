import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional(),
  repeat: SortOrderSchema.optional(),
  seatsCurrent: SortOrderSchema.optional(),
  seatsMax: SortOrderSchema.optional()
}).strict();
export const CourseAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CourseAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseAvgOrderByAggregateInput>;
export const CourseAvgOrderByAggregateInputObjectZodSchema = makeSchema();
