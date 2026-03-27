import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { InstructorCountOrderByAggregateInputObjectSchema as InstructorCountOrderByAggregateInputObjectSchema } from './InstructorCountOrderByAggregateInput.schema';
import { InstructorMaxOrderByAggregateInputObjectSchema as InstructorMaxOrderByAggregateInputObjectSchema } from './InstructorMaxOrderByAggregateInput.schema';
import { InstructorMinOrderByAggregateInputObjectSchema as InstructorMinOrderByAggregateInputObjectSchema } from './InstructorMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageUrl: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  _count: z.lazy(() => InstructorCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => InstructorMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => InstructorMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const InstructorOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.InstructorOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorOrderByWithAggregationInput>;
export const InstructorOrderByWithAggregationInputObjectZodSchema = makeSchema();
