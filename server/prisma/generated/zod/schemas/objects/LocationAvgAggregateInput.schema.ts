import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional(),
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional()
}).strict();
export const LocationAvgAggregateInputObjectSchema: z.ZodType<Prisma.LocationAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.LocationAvgAggregateInputType>;
export const LocationAvgAggregateInputObjectZodSchema = makeSchema();
