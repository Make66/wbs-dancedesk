import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional(),
  repeat: SortOrderSchema.optional(),
  seatsCurrent: SortOrderSchema.optional(),
  seatsMax: SortOrderSchema.optional()
}).strict();
export const CourseSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CourseSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseSumOrderByAggregateInput>;
export const CourseSumOrderByAggregateInputObjectZodSchema = makeSchema();
