import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseFindManySchema as CourseFindManySchema } from '../findManyCourse.schema';
import { TextCountOutputTypeArgsObjectSchema as TextCountOutputTypeArgsObjectSchema } from './TextCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  text: z.boolean().optional(),
  courseTerms: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  courseInfo: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  courses: z.union([z.boolean(), z.lazy(() => CourseFindManySchema)]).optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => TextCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TextSelectObjectSchema: z.ZodType<Prisma.TextSelect> = makeSchema() as unknown as z.ZodType<Prisma.TextSelect>;
export const TextSelectObjectZodSchema = makeSchema();
