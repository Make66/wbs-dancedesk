import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  longitude: SortOrderSchema.optional(),
  latitude: SortOrderSchema.optional()
}).strict();
export const CustomerSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CustomerSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerSumOrderByAggregateInput>;
export const CustomerSumOrderByAggregateInputObjectZodSchema = makeSchema();
