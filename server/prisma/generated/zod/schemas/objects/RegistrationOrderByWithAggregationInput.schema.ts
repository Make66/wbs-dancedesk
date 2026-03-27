import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RegistrationCountOrderByAggregateInputObjectSchema as RegistrationCountOrderByAggregateInputObjectSchema } from './RegistrationCountOrderByAggregateInput.schema';
import { RegistrationAvgOrderByAggregateInputObjectSchema as RegistrationAvgOrderByAggregateInputObjectSchema } from './RegistrationAvgOrderByAggregateInput.schema';
import { RegistrationMaxOrderByAggregateInputObjectSchema as RegistrationMaxOrderByAggregateInputObjectSchema } from './RegistrationMaxOrderByAggregateInput.schema';
import { RegistrationMinOrderByAggregateInputObjectSchema as RegistrationMinOrderByAggregateInputObjectSchema } from './RegistrationMinOrderByAggregateInput.schema';
import { RegistrationSumOrderByAggregateInputObjectSchema as RegistrationSumOrderByAggregateInputObjectSchema } from './RegistrationSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  firstName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lastName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
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
  _count: z.lazy(() => RegistrationCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RegistrationAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RegistrationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RegistrationMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RegistrationSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RegistrationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RegistrationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationOrderByWithAggregationInput>;
export const RegistrationOrderByWithAggregationInputObjectZodSchema = makeSchema();
