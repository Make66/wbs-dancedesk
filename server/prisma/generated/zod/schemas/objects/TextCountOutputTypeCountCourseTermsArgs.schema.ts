import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './CourseWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereInputObjectSchema).optional()
}).strict();
export const TextCountOutputTypeCountCourseTermsArgsObjectSchema = makeSchema();
export const TextCountOutputTypeCountCourseTermsArgsObjectZodSchema = makeSchema();
