import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  seq: SortOrderSchema.optional(),
  longitude: SortOrderSchema.optional(),
  latitude: SortOrderSchema.optional()
}).strict();
export const LocationAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocationAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationAvgOrderByAggregateInput>;
export const LocationAvgOrderByAggregateInputObjectZodSchema = makeSchema();
