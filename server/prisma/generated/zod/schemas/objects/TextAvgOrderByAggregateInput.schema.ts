import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  type: SortOrderSchema.optional()
}).strict();
export const TextAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TextAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TextAvgOrderByAggregateInput>;
export const TextAvgOrderByAggregateInputObjectZodSchema = makeSchema();
