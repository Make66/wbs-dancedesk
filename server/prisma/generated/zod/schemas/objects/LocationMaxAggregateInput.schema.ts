import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.literal(true).optional(),
  imageUrl: z.literal(true).optional(),
  seq: z.literal(true).optional(),
  active: z.literal(true).optional(),
  street: z.literal(true).optional(),
  city: z.literal(true).optional(),
  zipCode: z.literal(true).optional(),
  longitude: z.literal(true).optional(),
  latitude: z.literal(true).optional(),
  id: z.literal(true).optional(),
  tenantId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  isDeleted: z.literal(true).optional()
}).strict();
export const LocationMaxAggregateInputObjectSchema: z.ZodType<Prisma.LocationMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.LocationMaxAggregateInputType>;
export const LocationMaxAggregateInputObjectZodSchema = makeSchema();
