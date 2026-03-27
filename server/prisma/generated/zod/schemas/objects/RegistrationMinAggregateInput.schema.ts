import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
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
export const RegistrationMinAggregateInputObjectSchema: z.ZodType<Prisma.RegistrationMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationMinAggregateInputType>;
export const RegistrationMinAggregateInputObjectZodSchema = makeSchema();
