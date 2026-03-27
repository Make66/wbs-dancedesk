import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional()
}).strict();
export const TargetAvgAggregateInputObjectSchema: z.ZodType<Prisma.TargetAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TargetAvgAggregateInputType>;
export const TargetAvgAggregateInputObjectZodSchema = makeSchema();
