import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CategoryCreatecolorInputObjectSchema as CategoryCreatecolorInputObjectSchema } from './CategoryCreatecolorInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  targetId: z.string(),
  seq: z.number().int().optional(),
  color: z.union([z.lazy(() => CategoryCreatecolorInputObjectSchema), z.string().array()]).optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const CategoryUncheckedCreateInputObjectSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryUncheckedCreateInput>;
export const CategoryUncheckedCreateInputObjectZodSchema = makeSchema();
