import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './objects/CourseSelect.schema';
import { CourseUpdateManyMutationInputObjectSchema as CourseUpdateManyMutationInputObjectSchema } from './objects/CourseUpdateManyMutationInput.schema';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema';

export const CourseUpdateManyAndReturnSchema: z.ZodType<Prisma.CourseUpdateManyAndReturnArgs> = z.object({ select: CourseSelectObjectSchema.optional(), data: CourseUpdateManyMutationInputObjectSchema, where: CourseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CourseUpdateManyAndReturnArgs>;

export const CourseUpdateManyAndReturnZodSchema = z.object({ select: CourseSelectObjectSchema.optional(), data: CourseUpdateManyMutationInputObjectSchema, where: CourseWhereInputObjectSchema.optional() }).strict();