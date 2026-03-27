import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

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
  isDeleted: SortOrderSchema.optional()
}).strict();
export const CustomerOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CustomerOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerOrderByWithRelationInput>;
export const CustomerOrderByWithRelationInputObjectZodSchema = makeSchema();
