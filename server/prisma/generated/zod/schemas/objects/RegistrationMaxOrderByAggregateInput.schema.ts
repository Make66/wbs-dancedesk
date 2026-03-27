import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  street: SortOrderSchema.optional(),
  city: SortOrderSchema.optional(),
  zipCode: SortOrderSchema.optional(),
  longitude: SortOrderSchema.optional(),
  latitude: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional()
}).strict();
export const RegistrationMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RegistrationMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationMaxOrderByAggregateInput>;
export const RegistrationMaxOrderByAggregateInputObjectZodSchema = makeSchema();
