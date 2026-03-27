import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { LocationCountOrderByAggregateInputObjectSchema as LocationCountOrderByAggregateInputObjectSchema } from './LocationCountOrderByAggregateInput.schema';
import { LocationAvgOrderByAggregateInputObjectSchema as LocationAvgOrderByAggregateInputObjectSchema } from './LocationAvgOrderByAggregateInput.schema';
import { LocationMaxOrderByAggregateInputObjectSchema as LocationMaxOrderByAggregateInputObjectSchema } from './LocationMaxOrderByAggregateInput.schema';
import { LocationMinOrderByAggregateInputObjectSchema as LocationMinOrderByAggregateInputObjectSchema } from './LocationMinOrderByAggregateInput.schema';
import { LocationSumOrderByAggregateInputObjectSchema as LocationSumOrderByAggregateInputObjectSchema } from './LocationSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageUrl: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  street: SortOrderSchema.optional(),
  city: SortOrderSchema.optional(),
  zipCode: SortOrderSchema.optional(),
  longitude: SortOrderSchema.optional(),
  latitude: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => LocationAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => LocationSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const LocationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationOrderByWithAggregationInput>;
export const LocationOrderByWithAggregationInputObjectZodSchema = makeSchema();
