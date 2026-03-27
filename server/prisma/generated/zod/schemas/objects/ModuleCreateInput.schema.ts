import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.string().optional(),
  seq: z.number().int().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const ModuleCreateInputObjectSchema: z.ZodType<Prisma.ModuleCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleCreateInput>;
export const ModuleCreateInputObjectZodSchema = makeSchema();
