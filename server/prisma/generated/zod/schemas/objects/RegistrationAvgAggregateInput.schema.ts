import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional()
}).strict();
export const RegistrationAvgAggregateInputObjectSchema: z.ZodType<Prisma.RegistrationAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationAvgAggregateInputType>;
export const RegistrationAvgAggregateInputObjectZodSchema = makeSchema();
