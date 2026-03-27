import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional(),
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional()
}).strict();
export const LocationSumAggregateInputObjectSchema: z.ZodType<Prisma.LocationSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.LocationSumAggregateInputType>;
export const LocationSumAggregateInputObjectZodSchema = makeSchema();
