import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseUpdateManyMutationInputObjectSchema as CourseUpdateManyMutationInputObjectSchema } from './objects/CourseUpdateManyMutationInput.schema';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema';

export const CourseUpdateManySchema: z.ZodType<Prisma.CourseUpdateManyArgs> = z.object({ data: CourseUpdateManyMutationInputObjectSchema, where: CourseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CourseUpdateManyArgs>;

export const CourseUpdateManyZodSchema = z.object({ data: CourseUpdateManyMutationInputObjectSchema, where: CourseWhereInputObjectSchema.optional() }).strict();