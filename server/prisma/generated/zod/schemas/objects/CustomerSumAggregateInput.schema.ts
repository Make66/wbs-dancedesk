import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional()
}).strict();
export const CustomerSumAggregateInputObjectSchema: z.ZodType<Prisma.CustomerSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CustomerSumAggregateInputType>;
export const CustomerSumAggregateInputObjectZodSchema = makeSchema();
