import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  seq: z.boolean().optional(),
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
export const LocationSelectObjectSchema: z.ZodType<Prisma.LocationSelect> = makeSchema() as unknown as z.ZodType<Prisma.LocationSelect>;
export const LocationSelectObjectZodSchema = makeSchema();
