import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TargetArgsObjectSchema as TargetArgsObjectSchema } from './TargetArgs.schema'

const makeSchema = () => z.object({
  name: z.boolean().optional(),
  target: z.union([z.boolean(), z.lazy(() => TargetArgsObjectSchema)]).optional(),
  targetId: z.boolean().optional(),
  seq: z.boolean().optional(),
  color: z.boolean().optional(),
  active: z.boolean().optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const CategorySelectObjectSchema: z.ZodType<Prisma.CategorySelect> = makeSchema() as unknown as z.ZodType<Prisma.CategorySelect>;
export const CategorySelectObjectZodSchema = makeSchema();
