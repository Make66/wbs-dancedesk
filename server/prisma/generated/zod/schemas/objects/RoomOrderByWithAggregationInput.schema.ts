import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoomCountOrderByAggregateInputObjectSchema as RoomCountOrderByAggregateInputObjectSchema } from './RoomCountOrderByAggregateInput.schema';
import { RoomAvgOrderByAggregateInputObjectSchema as RoomAvgOrderByAggregateInputObjectSchema } from './RoomAvgOrderByAggregateInput.schema';
import { RoomMaxOrderByAggregateInputObjectSchema as RoomMaxOrderByAggregateInputObjectSchema } from './RoomMaxOrderByAggregateInput.schema';
import { RoomMinOrderByAggregateInputObjectSchema as RoomMinOrderByAggregateInputObjectSchema } from './RoomMinOrderByAggregateInput.schema';
import { RoomSumOrderByAggregateInputObjectSchema as RoomSumOrderByAggregateInputObjectSchema } from './RoomSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageUrl: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RoomAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RoomSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RoomOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RoomOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.RoomOrderByWithAggregationInput>;
export const RoomOrderByWithAggregationInputObjectZodSchema = makeSchema();
