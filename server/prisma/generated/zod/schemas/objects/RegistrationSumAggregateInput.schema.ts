import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional()
}).strict();
export const RegistrationSumAggregateInputObjectSchema: z.ZodType<Prisma.RegistrationSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationSumAggregateInputType>;
export const RegistrationSumAggregateInputObjectZodSchema = makeSchema();
