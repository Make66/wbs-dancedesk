import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './objects/CourseSelect.schema';
import { CourseCreateManyInputObjectSchema as CourseCreateManyInputObjectSchema } from './objects/CourseCreateManyInput.schema';

export const CourseCreateManyAndReturnSchema: z.ZodType<Prisma.CourseCreateManyAndReturnArgs> = z.object({ select: CourseSelectObjectSchema.optional(), data: z.union([ CourseCreateManyInputObjectSchema, z.array(CourseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CourseCreateManyAndReturnArgs>;

export const CourseCreateManyAndReturnZodSchema = z.object({ select: CourseSelectObjectSchema.optional(), data: z.union([ CourseCreateManyInputObjectSchema, z.array(CourseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();