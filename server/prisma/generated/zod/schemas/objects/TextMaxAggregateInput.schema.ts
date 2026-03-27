import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.literal(true).optional(),
  type: z.literal(true).optional(),
  text: z.literal(true).optional(),
  id: z.literal(true).optional(),
  tenantId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  isDeleted: z.literal(true).optional()
}).strict();
export const TextMaxAggregateInputObjectSchema: z.ZodType<Prisma.TextMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TextMaxAggregateInputType>;
export const TextMaxAggregateInputObjectZodSchema = makeSchema();
