import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CustomerCountOrderByAggregateInputObjectSchema as CustomerCountOrderByAggregateInputObjectSchema } from './CustomerCountOrderByAggregateInput.schema';
import { CustomerAvgOrderByAggregateInputObjectSchema as CustomerAvgOrderByAggregateInputObjectSchema } from './CustomerAvgOrderByAggregateInput.schema';
import { CustomerMaxOrderByAggregateInputObjectSchema as CustomerMaxOrderByAggregateInputObjectSchema } from './CustomerMaxOrderByAggregateInput.schema';
import { CustomerMinOrderByAggregateInputObjectSchema as CustomerMinOrderByAggregateInputObjectSchema } from './CustomerMinOrderByAggregateInput.schema';
import { CustomerSumOrderByAggregateInputObjectSchema as CustomerSumOrderByAggregateInputObjectSchema } from './CustomerSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  website: SortOrderSchema.optional(),
  logoUrl: SortOrderSchema.optional(),
  primary: SortOrderSchema.optional(),
  secondary: SortOrderSchema.optional(),
  tertiary: SortOrderSchema.optional(),
  quaternary: SortOrderSchema.optional(),
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
  _count: z.lazy(() => CustomerCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CustomerAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CustomerMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CustomerMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CustomerSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CustomerOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CustomerOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerOrderByWithAggregationInput>;
export const CustomerOrderByWithAggregationInputObjectZodSchema = makeSchema();
