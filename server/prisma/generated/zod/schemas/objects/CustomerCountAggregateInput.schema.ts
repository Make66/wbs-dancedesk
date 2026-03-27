import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.literal(true).optional(),
  email: z.literal(true).optional(),
  website: z.literal(true).optional(),
  logoUrl: z.literal(true).optional(),
  primary: z.literal(true).optional(),
  secondary: z.literal(true).optional(),
  tertiary: z.literal(true).optional(),
  quaternary: z.literal(true).optional(),
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
  isDeleted: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CustomerCountAggregateInputObjectSchema: z.ZodType<Prisma.CustomerCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCountAggregateInputType>;
export const CustomerCountAggregateInputObjectZodSchema = makeSchema();
