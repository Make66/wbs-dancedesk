import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional()
}).strict();
export const CustomerAvgAggregateInputObjectSchema: z.ZodType<Prisma.CustomerAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CustomerAvgAggregateInputType>;
export const CustomerAvgAggregateInputObjectZodSchema = makeSchema();
