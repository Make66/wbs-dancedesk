import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  type: SortOrderSchema.optional()
}).strict();
export const TextSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TextSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TextSumOrderByAggregateInput>;
export const TextSumOrderByAggregateInputObjectZodSchema = makeSchema();
