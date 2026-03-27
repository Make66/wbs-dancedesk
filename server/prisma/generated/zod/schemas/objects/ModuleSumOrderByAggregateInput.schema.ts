import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional()
}).strict();
export const ModuleSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ModuleSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleSumOrderByAggregateInput>;
export const ModuleSumOrderByAggregateInputObjectZodSchema = makeSchema();
