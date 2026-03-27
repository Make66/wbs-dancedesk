import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  seq: z.literal(true).optional(),
  active: z.literal(true).optional(),
  id: z.literal(true).optional(),
  tenantId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  isDeleted: z.literal(true).optional()
}).strict();
export const CategoryMaxAggregateInputObjectSchema: z.ZodType<Prisma.CategoryMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CategoryMaxAggregateInputType>;
export const CategoryMaxAggregateInputObjectZodSchema = makeSchema();
