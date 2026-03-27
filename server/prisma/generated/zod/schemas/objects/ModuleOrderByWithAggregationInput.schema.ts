import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ModuleCountOrderByAggregateInputObjectSchema as ModuleCountOrderByAggregateInputObjectSchema } from './ModuleCountOrderByAggregateInput.schema';
import { ModuleAvgOrderByAggregateInputObjectSchema as ModuleAvgOrderByAggregateInputObjectSchema } from './ModuleAvgOrderByAggregateInput.schema';
import { ModuleMaxOrderByAggregateInputObjectSchema as ModuleMaxOrderByAggregateInputObjectSchema } from './ModuleMaxOrderByAggregateInput.schema';
import { ModuleMinOrderByAggregateInputObjectSchema as ModuleMinOrderByAggregateInputObjectSchema } from './ModuleMinOrderByAggregateInput.schema';
import { ModuleSumOrderByAggregateInputObjectSchema as ModuleSumOrderByAggregateInputObjectSchema } from './ModuleSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => ModuleCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ModuleAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ModuleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ModuleMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ModuleSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ModuleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ModuleOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleOrderByWithAggregationInput>;
export const ModuleOrderByWithAggregationInputObjectZodSchema = makeSchema();
