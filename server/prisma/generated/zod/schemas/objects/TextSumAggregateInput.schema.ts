import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  type: z.literal(true).optional()
}).strict();
export const TextSumAggregateInputObjectSchema: z.ZodType<Prisma.TextSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TextSumAggregateInputType>;
export const TextSumAggregateInputObjectZodSchema = makeSchema();
