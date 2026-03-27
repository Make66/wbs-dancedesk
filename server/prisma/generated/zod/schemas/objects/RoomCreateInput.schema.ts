import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  capacity: z.number().int().optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const RoomCreateInputObjectSchema: z.ZodType<Prisma.RoomCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoomCreateInput>;
export const RoomCreateInputObjectZodSchema = makeSchema();
