import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  name: SortOrderSchema.optional(),
  imageUrl: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional()
}).strict();
export const RoomCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoomCountOrderByAggregateInput>;
export const RoomCountOrderByAggregateInputObjectZodSchema = makeSchema();
