import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  text: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional()
}).strict();
export const TextMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TextMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TextMinOrderByAggregateInput>;
export const TextMinOrderByAggregateInputObjectZodSchema = makeSchema();
