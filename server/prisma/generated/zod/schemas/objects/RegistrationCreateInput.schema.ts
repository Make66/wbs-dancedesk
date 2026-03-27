import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const RegistrationCreateInputObjectSchema: z.ZodType<Prisma.RegistrationCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RegistrationCreateInput>;
export const RegistrationCreateInputObjectZodSchema = makeSchema();
