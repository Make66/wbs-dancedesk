import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  seq: z.number().int().optional(),
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
export const LocationCreateManyInputObjectSchema: z.ZodType<Prisma.LocationCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCreateManyInput>;
export const LocationCreateManyInputObjectZodSchema = makeSchema();
