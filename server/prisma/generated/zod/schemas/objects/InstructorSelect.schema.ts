import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseFindManySchema as CourseFindManySchema } from '../findManyCourse.schema';
import { InstructorCountOutputTypeArgsObjectSchema as InstructorCountOutputTypeArgsObjectSchema } from './InstructorCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  name: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  active: z.boolean().optional(),
  courses: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => InstructorCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const InstructorSelectObjectSchema: z.ZodType<Prisma.InstructorSelect> = makeSchema() as unknown as z.ZodType<Prisma.InstructorSelect>;
export const InstructorSelectObjectZodSchema = makeSchema();
