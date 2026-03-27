import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './objects/CourseSelect.schema';
import { CourseIncludeObjectSchema as CourseIncludeObjectSchema } from './objects/CourseInclude.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema';
import { CourseCreateInputObjectSchema as CourseCreateInputObjectSchema } from './objects/CourseCreateInput.schema';
import { CourseUncheckedCreateInputObjectSchema as CourseUncheckedCreateInputObjectSchema } from './objects/CourseUncheckedCreateInput.schema';
import { CourseUpdateInputObjectSchema as CourseUpdateInputObjectSchema } from './objects/CourseUpdateInput.schema';
import { CourseUncheckedUpdateInputObjectSchema as CourseUncheckedUpdateInputObjectSchema } from './objects/CourseUncheckedUpdateInput.schema';

export const CourseUpsertOneSchema: z.ZodType<Prisma.CourseUpsertArgs> = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), where: CourseWhereUniqueInputObjectSchema, create: z.union([ CourseCreateInputObjectSchema, CourseUncheckedCreateInputObjectSchema ]), update: z.union([ CourseUpdateInputObjectSchema, CourseUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CourseUpsertArgs>;

export const CourseUpsertOneZodSchema = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), where: CourseWhereUniqueInputObjectSchema, create: z.union([ CourseCreateInputObjectSchema, CourseUncheckedCreateInputObjectSchema ]), update: z.union([ CourseUpdateInputObjectSchema, CourseUncheckedUpdateInputObjectSchema ]) }).strict();