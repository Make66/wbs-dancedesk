import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './CourseSelect.schema';
import { CourseIncludeObjectSchema as CourseIncludeObjectSchema } from './CourseInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CourseSelectObjectSchema).optional(),
  include: z.lazy(() => CourseIncludeObjectSchema).optional()
}).strict();
export const CourseArgsObjectSchema = makeSchema();
export const CourseArgsObjectZodSchema = makeSchema();
