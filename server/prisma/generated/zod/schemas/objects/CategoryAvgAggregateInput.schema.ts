import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional()
}).strict();
export const CategoryAvgAggregateInputObjectSchema: z.ZodType<Prisma.CategoryAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CategoryAvgAggregateInputType>;
export const CategoryAvgAggregateInputObjectZodSchema = makeSchema();
