import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CategoryCountOrderByAggregateInputObjectSchema as CategoryCountOrderByAggregateInputObjectSchema } from './CategoryCountOrderByAggregateInput.schema';
import { CategoryAvgOrderByAggregateInputObjectSchema as CategoryAvgOrderByAggregateInputObjectSchema } from './CategoryAvgOrderByAggregateInput.schema';
import { CategoryMaxOrderByAggregateInputObjectSchema as CategoryMaxOrderByAggregateInputObjectSchema } from './CategoryMaxOrderByAggregateInput.schema';
import { CategoryMinOrderByAggregateInputObjectSchema as CategoryMinOrderByAggregateInputObjectSchema } from './CategoryMinOrderByAggregateInput.schema';
import { CategorySumOrderByAggregateInputObjectSchema as CategorySumOrderByAggregateInputObjectSchema } from './CategorySumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetId: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CategoryAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CategorySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CategoryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryOrderByWithAggregationInput>;
export const CategoryOrderByWithAggregationInputObjectZodSchema = makeSchema();
