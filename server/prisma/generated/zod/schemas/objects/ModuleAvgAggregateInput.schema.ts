import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional()
}).strict();
export const ModuleAvgAggregateInputObjectSchema: z.ZodType<Prisma.ModuleAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ModuleAvgAggregateInputType>;
export const ModuleAvgAggregateInputObjectZodSchema = makeSchema();
