import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  website: z.boolean().optional(),
  logoUrl: z.boolean().optional(),
  primary: z.boolean().optional(),
  secondary: z.boolean().optional(),
  tertiary: z.boolean().optional(),
  quaternary: z.boolean().optional(),
  active: z.boolean().optional(),
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
export const CustomerSelectObjectSchema: z.ZodType<Prisma.CustomerSelect> = makeSchema() as unknown as z.ZodType<Prisma.CustomerSelect>;
export const CustomerSelectObjectZodSchema = makeSchema();
