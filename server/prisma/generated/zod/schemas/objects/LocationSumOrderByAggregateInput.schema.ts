import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional(),
  longitude: SortOrderSchema.optional(),
  latitude: SortOrderSchema.optional()
}).strict();
export const LocationSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocationSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationSumOrderByAggregateInput>;
export const LocationSumOrderByAggregateInputObjectZodSchema = makeSchema();
