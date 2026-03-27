import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseUncheckedCreateNestedManyWithoutInstructorInputObjectSchema as CourseUncheckedCreateNestedManyWithoutInstructorInputObjectSchema } from './CourseUncheckedCreateNestedManyWithoutInstructorInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  courses: z.lazy(() => CourseUncheckedCreateNestedManyWithoutInstructorInputObjectSchema).optional()
}).strict();
export const InstructorUncheckedCreateInputObjectSchema: z.ZodType<Prisma.InstructorUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorUncheckedCreateInput>;
export const InstructorUncheckedCreateInputObjectZodSchema = makeSchema();
