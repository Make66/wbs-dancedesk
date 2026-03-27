import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  type: z.literal(true).optional()
}).strict();
export const TextAvgAggregateInputObjectSchema: z.ZodType<Prisma.TextAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TextAvgAggregateInputType>;
export const TextAvgAggregateInputObjectZodSchema = makeSchema();
