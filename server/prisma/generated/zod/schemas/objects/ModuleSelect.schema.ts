import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.boolean().optional(),
  seq: z.boolean().optional(),
  color: z.boolean().optional(),
  active: z.boolean().optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const ModuleSelectObjectSchema: z.ZodType<Prisma.ModuleSelect> = makeSchema() as unknown as z.ZodType<Prisma.ModuleSelect>;
export const ModuleSelectObjectZodSchema = makeSchema();
