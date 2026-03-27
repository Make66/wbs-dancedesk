import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  tertiary: z.string().optional(),
  quaternary: z.string().optional(),
  active: z.boolean().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const CustomerCreateManyInputObjectSchema: z.ZodType<Prisma.CustomerCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateManyInput>;
export const CustomerCreateManyInputObjectZodSchema = makeSchema();
