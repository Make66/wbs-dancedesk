import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional()
}).strict();
export const ModuleAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ModuleAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleAvgOrderByAggregateInput>;
export const ModuleAvgOrderByAggregateInputObjectZodSchema = makeSchema();
