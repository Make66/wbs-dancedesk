import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TargetCountOrderByAggregateInputObjectSchema as TargetCountOrderByAggregateInputObjectSchema } from './TargetCountOrderByAggregateInput.schema';
import { TargetAvgOrderByAggregateInputObjectSchema as TargetAvgOrderByAggregateInputObjectSchema } from './TargetAvgOrderByAggregateInput.schema';
import { TargetMaxOrderByAggregateInputObjectSchema as TargetMaxOrderByAggregateInputObjectSchema } from './TargetMaxOrderByAggregateInput.schema';
import { TargetMinOrderByAggregateInputObjectSchema as TargetMinOrderByAggregateInputObjectSchema } from './TargetMinOrderByAggregateInput.schema';
import { TargetSumOrderByAggregateInputObjectSchema as TargetSumOrderByAggregateInputObjectSchema } from './TargetSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  icon: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => TargetCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TargetAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TargetMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TargetMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TargetSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TargetOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TargetOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TargetOrderByWithAggregationInput>;
export const TargetOrderByWithAggregationInputObjectZodSchema = makeSchema();
