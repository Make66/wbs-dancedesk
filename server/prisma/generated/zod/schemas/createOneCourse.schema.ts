import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseSelectObjectSchema as CourseSelectObjectSchema } from './objects/CourseSelect.schema';
import { CourseIncludeObjectSchema as CourseIncludeObjectSchema } from './objects/CourseInclude.schema';
import { CourseCreateInputObjectSchema as CourseCreateInputObjectSchema } from './objects/CourseCreateInput.schema';
import { CourseUncheckedCreateInputObjectSchema as CourseUncheckedCreateInputObjectSchema } from './objects/CourseUncheckedCreateInput.schema';

export const CourseCreateOneSchema: z.ZodType<Prisma.CourseCreateArgs> = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), data: z.union([CourseCreateInputObjectSchema, CourseUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CourseCreateArgs>;

export const CourseCreateOneZodSchema = z.object({ select: CourseSelectObjectSchema.optional(), include: CourseIncludeObjectSchema.optional(), data: z.union([CourseCreateInputObjectSchema, CourseUncheckedCreateInputObjectSchema]) }).strict();