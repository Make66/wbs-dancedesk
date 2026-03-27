import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TargetCreatecolorInputObjectSchema as TargetCreatecolorInputObjectSchema } from './TargetCreatecolorInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  icon: z.string().optional(),
  seq: z.number().int().optional(),
  color: z.union([z.lazy(() => TargetCreatecolorInputObjectSchema), z.string().array()]).optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const TargetCreateManyInputObjectSchema: z.ZodType<Prisma.TargetCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TargetCreateManyInput>;
export const TargetCreateManyInputObjectZodSchema = makeSchema();
