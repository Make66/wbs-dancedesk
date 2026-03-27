import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageUrl: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional()
}).strict();
export const RoomOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RoomOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.RoomOrderByWithRelationInput>;
export const RoomOrderByWithRelationInputObjectZodSchema = makeSchema();
