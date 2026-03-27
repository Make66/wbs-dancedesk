import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  type: z.number().int().optional(),
  text: z.string().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const TextCreateManyInputObjectSchema: z.ZodType<Prisma.TextCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateManyInput>;
export const TextCreateManyInputObjectZodSchema = makeSchema();
