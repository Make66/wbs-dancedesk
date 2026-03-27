import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  name: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional()
}).strict();
export const ModuleMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ModuleMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleMinOrderByAggregateInput>;
export const ModuleMinOrderByAggregateInputObjectZodSchema = makeSchema();
