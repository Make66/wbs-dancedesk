import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TextCountOrderByAggregateInputObjectSchema as TextCountOrderByAggregateInputObjectSchema } from './TextCountOrderByAggregateInput.schema';
import { TextAvgOrderByAggregateInputObjectSchema as TextAvgOrderByAggregateInputObjectSchema } from './TextAvgOrderByAggregateInput.schema';
import { TextMaxOrderByAggregateInputObjectSchema as TextMaxOrderByAggregateInputObjectSchema } from './TextMaxOrderByAggregateInput.schema';
import { TextMinOrderByAggregateInputObjectSchema as TextMinOrderByAggregateInputObjectSchema } from './TextMinOrderByAggregateInput.schema';
import { TextSumOrderByAggregateInputObjectSchema as TextSumOrderByAggregateInputObjectSchema } from './TextSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  text: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => TextCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TextAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TextMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TextMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TextSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TextOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TextOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TextOrderByWithAggregationInput>;
export const TextOrderByWithAggregationInputObjectZodSchema = makeSchema();
