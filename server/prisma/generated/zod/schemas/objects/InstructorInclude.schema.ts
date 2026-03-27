import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseFindManySchema as CourseFindManySchema } from '../findManyCourse.schema';
import { InstructorCountOutputTypeArgsObjectSchema as InstructorCountOutputTypeArgsObjectSchema } from './InstructorCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  courses: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => InstructorCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const InstructorIncludeObjectSchema: z.ZodType<Prisma.InstructorInclude> = makeSchema() as unknown as z.ZodType<Prisma.InstructorInclude>;
export const InstructorIncludeObjectZodSchema = makeSchema();
