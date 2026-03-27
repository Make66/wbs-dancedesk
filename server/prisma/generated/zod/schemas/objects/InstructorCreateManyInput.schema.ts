import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const InstructorCreateManyInputObjectSchema: z.ZodType<Prisma.InstructorCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorCreateManyInput>;
export const InstructorCreateManyInputObjectZodSchema = makeSchema();
