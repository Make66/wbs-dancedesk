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
export const ModuleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ModuleCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleCountOrderByAggregateInput>;
export const ModuleCountOrderByAggregateInputObjectZodSchema = makeSchema();
