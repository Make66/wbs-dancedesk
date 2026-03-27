import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  capacity: z.boolean().optional(),
  active: z.boolean().optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const RoomSelectObjectSchema: z.ZodType<Prisma.RoomSelect> = makeSchema() as unknown as z.ZodType<Prisma.RoomSelect>;
export const RoomSelectObjectZodSchema = makeSchema();
