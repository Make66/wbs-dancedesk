import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseCreateManyInputObjectSchema as CourseCreateManyInputObjectSchema } from './objects/CourseCreateManyInput.schema';

export const CourseCreateManySchema: z.ZodType<Prisma.CourseCreateManyArgs> = z.object({ data: z.union([ CourseCreateManyInputObjectSchema, z.array(CourseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CourseCreateManyArgs>;

export const CourseCreateManyZodSchema = z.object({ data: z.union([ CourseCreateManyInputObjectSchema, z.array(CourseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();