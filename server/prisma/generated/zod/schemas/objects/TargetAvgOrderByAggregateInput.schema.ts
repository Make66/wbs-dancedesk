import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional()
}).strict();
export const TargetAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TargetAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TargetAvgOrderByAggregateInput>;
export const TargetAvgOrderByAggregateInputObjectZodSchema = makeSchema();
