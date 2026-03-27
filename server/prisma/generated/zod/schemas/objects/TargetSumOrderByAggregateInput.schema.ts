import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional()
}).strict();
export const TargetSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TargetSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TargetSumOrderByAggregateInput>;
export const TargetSumOrderByAggregateInputObjectZodSchema = makeSchema();
