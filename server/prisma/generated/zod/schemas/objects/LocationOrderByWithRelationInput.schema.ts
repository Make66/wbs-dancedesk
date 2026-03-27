import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

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
  isDeleted: SortOrderSchema.optional()
}).strict();
export const LocationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationOrderByWithRelationInput>;
export const LocationOrderByWithRelationInputObjectZodSchema = makeSchema();
