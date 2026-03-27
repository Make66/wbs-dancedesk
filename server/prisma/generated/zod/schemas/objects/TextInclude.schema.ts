import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseFindManySchema as CourseFindManySchema } from '../findManyCourse.schema';
import { TextCountOutputTypeArgsObjectSchema as TextCountOutputTypeArgsObjectSchema } from './TextCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  courseTerms: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  courseInfo: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  courses: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TextCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TextIncludeObjectSchema: z.ZodType<Prisma.TextInclude> = makeSchema() as unknown as z.ZodType<Prisma.TextInclude>;
export const TextIncludeObjectZodSchema = makeSchema();
