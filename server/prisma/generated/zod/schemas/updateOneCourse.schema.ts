import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './objects/CourseSelect.schema';
import { CourseIncludeObjectSchema as CourseIncludeObjectSchema } from './objects/CourseInclude.schema';
import { CourseUpdateInputObjectSchema as CourseUpdateInputObjectSchema } from './objects/CourseUpdateInput.schema';
import { CourseUncheckedUpdateInputObjectSchema as CourseUncheckedUpdateInputObjectSchema } from './objects/CourseUncheckedUpdateInput.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema';

export const CourseUpdateOneSchema: z.ZodType<Prisma.CourseUpdateArgs> = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), data: z.union([CourseUpdateInputObjectSchema, CourseUncheckedUpdateInputObjectSchema]), where: CourseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CourseUpdateArgs>;

export const CourseUpdateOneZodSchema = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), data: z.union([CourseUpdateInputObjectSchema, CourseUncheckedUpdateInputObjectSchema]), where: CourseWhereUniqueInputObjectSchema }).strict();