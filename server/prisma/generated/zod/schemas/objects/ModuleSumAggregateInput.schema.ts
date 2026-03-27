import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  seq: z.literal(true).optional()
}).strict();
export const ModuleSumAggregateInputObjectSchema: z.ZodType<Prisma.ModuleSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ModuleSumAggregateInputType>;
export const ModuleSumAggregateInputObjectZodSchema = makeSchema();
