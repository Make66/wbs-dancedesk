import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './objects/CourseSelect.schema';
import { CourseIncludeObjectSchema as CourseIncludeObjectSchema } from './objects/CourseInclude.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema';

export const CourseDeleteOneSchema: z.ZodType<Prisma.CourseDeleteArgs> = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), where: CourseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CourseDeleteArgs>;

export const CourseDeleteOneZodSchema = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), where: CourseWhereUniqueInputObjectSchema }).strict();