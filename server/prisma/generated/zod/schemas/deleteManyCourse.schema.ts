import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema';

export const CourseDeleteManySchema: z.ZodType<Prisma.CourseDeleteManyArgs> = z.object({ where: CourseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CourseDeleteManyArgs>;

export const CourseDeleteManyZodSchema = z.object({ where: CourseWhereInputObjectSchema.optional() }).strict();