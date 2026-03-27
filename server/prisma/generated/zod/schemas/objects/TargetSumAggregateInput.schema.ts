import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional()
}).strict();
export const TargetSumAggregateInputObjectSchema: z.ZodType<Prisma.TargetSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TargetSumAggregateInputType>;
export const TargetSumAggregateInputObjectZodSchema = makeSchema();
