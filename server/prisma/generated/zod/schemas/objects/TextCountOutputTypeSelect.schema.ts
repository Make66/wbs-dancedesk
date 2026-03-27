import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCountOutputTypeCountCourseTermsArgsObjectSchema as TextCountOutputTypeCountCourseTermsArgsObjectSchema } from './TextCountOutputTypeCountCourseTermsArgs.schema';
import { TextCountOutputTypeCountCourseInfoArgsObjectSchema as TextCountOutputTypeCountCourseInfoArgsObjectSchema } from './TextCountOutputTypeCountCourseInfoArgs.schema';
import { TextCountOutputTypeCountCoursesArgsObjectSchema as TextCountOutputTypeCountCoursesArgsObjectSchema } from './TextCountOutputTypeCountCoursesArgs.schema'

const makeSchema = () => z.object({
  courseTerms: z.union([z.boolean(), z.lazy(() => TextCountOutputTypeCountCourseTermsArgsObjectSchema)]).optional(),
  courseInfo: z.union([z.boolean(), z.lazy(() => TextCountOutputTypeCountCourseInfoArgsObjectSchema)]).optional(),
  courses: z.union([z.boolean(), z.lazy(() => TextCountOutputTypeCountCoursesArgsObjectSchema)]).optional()
}).strict();
export const TextCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TextCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TextCountOutputTypeSelect>;
export const TextCountOutputTypeSelectObjectZodSchema = makeSchema();
