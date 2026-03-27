import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  street: z.boolean().optional(),
  city: z.boolean().optional(),
  zipCode: z.boolean().optional(),
  longitude: z.boolean().optional(),
  latitude: z.boolean().optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const RegistrationSelectObjectSchema: z.ZodType<Prisma.RegistrationSelect> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationSelect>;
export const RegistrationSelectObjectZodSchema = makeSchema();
