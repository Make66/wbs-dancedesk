import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional()
}).strict();
export const CategorySumAggregateInputObjectSchema: z.ZodType<Prisma.CategorySumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CategorySumAggregateInputType>;
export const CategorySumAggregateInputObjectZodSchema = makeSchema();
