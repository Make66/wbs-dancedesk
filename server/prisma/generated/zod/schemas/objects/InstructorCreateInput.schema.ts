import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateNestedManyWithoutInstructorInputObjectSchema as CourseCreateNestedManyWithoutInstructorInputObjectSchema } from './CourseCreateNestedManyWithoutInstructorInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  courses: z.lazy(() => CourseCreateNestedManyWithoutInstructorInputObjectSchema).optional()
}).strict();
export const InstructorCreateInputObjectSchema: z.ZodType<Prisma.InstructorCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorCreateInput>;
export const InstructorCreateInputObjectZodSchema = makeSchema();
