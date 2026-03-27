import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  capacity: SortOrderSchema.optional()
}).strict();
export const RoomAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoomAvgOrderByAggregateInput>;
export const RoomAvgOrderByAggregateInputObjectZodSchema = makeSchema();
