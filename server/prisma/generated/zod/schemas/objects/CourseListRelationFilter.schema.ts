import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './CourseWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CourseWhereInputObjectSchema).optional(),
  some: z.lazy(() => CourseWhereInputObjectSchema).optional(),
  none: z.lazy(() => CourseWhereInputObjectSchema).optional()
}).strict();
export const CourseListRelationFilterObjectSchema: z.ZodType<Prisma.CourseListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CourseListRelationFilter>;
export const CourseListRelationFilterObjectZodSchema = makeSchema();
