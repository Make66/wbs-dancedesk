import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CourseOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CourseOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseOrderByRelationAggregateInput>;
export const CourseOrderByRelationAggregateInputObjectZodSchema = makeSchema();
