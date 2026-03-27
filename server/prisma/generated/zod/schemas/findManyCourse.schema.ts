import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseIncludeObjectSchema as CourseIncludeObjectSchema } from './objects/CourseInclude.schema';
import { CourseOrderByWithRelationInputObjectSchema as CourseOrderByWithRelationInputObjectSchema } from './objects/CourseOrderByWithRelationInput.schema';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema';
import { CourseScalarFieldEnumSchema } from './enums/CourseScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CourseFindManySelectSchema: z.ZodType<Prisma.CourseSelect> = z.object({
    name: z.boolean().optional(),
    category: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    seq: z.boolean().optional(),
    active: z.boolean().optional(),
    startsAt: z.boolean().optional(),
    endsAt: z.boolean().optional(),
    repeat: z.boolean().optional(),
    frequency: z.boolean().optional(),
    room: z.boolean().optional(),
    roomId: z.boolean().optional(),
    isIgnoreCalendar: z.boolean().optional(),
    dates: z.boolean().optional(),
    seatsCurrent: z.boolean().optional(),
    seatsMax: z.boolean().optional(),
    paymentTypes: z.boolean().optional(),
    contractTypes: z.boolean().optional(),
    instructor: z.boolean().optional(),
    instructorId: z.boolean().optional(),
    textTerms: z.boolean().optional(),
    textTermsId: z.boolean().optional(),
    textInfo: z.boolean().optional(),
    textInfoId: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    text: z.boolean().optional(),
    textId: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CourseSelect>;

export const CourseFindManySelectZodSchema = z.object({
    name: z.boolean().optional(),
    category: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    seq: z.boolean().optional(),
    active: z.boolean().optional(),
    startsAt: z.boolean().optional(),
    endsAt: z.boolean().optional(),
    repeat: z.boolean().optional(),
    frequency: z.boolean().optional(),
    room: z.boolean().optional(),
    roomId: z.boolean().optional(),
    isIgnoreCalendar: z.boolean().optional(),
    dates: z.boolean().optional(),
    seatsCurrent: z.boolean().optional(),
    seatsMax: z.boolean().optional(),
    paymentTypes: z.boolean().optional(),
    contractTypes: z.boolean().optional(),
    instructor: z.boolean().optional(),
    instructorId: z.boolean().optional(),
    textTerms: z.boolean().optional(),
    textTermsId: z.boolean().optional(),
    textInfo: z.boolean().optional(),
    textInfoId: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    text: z.boolean().optional(),
    textId: z.boolean().optional()
  }).strict();

export const CourseFindManySchema: z.ZodType<Prisma.CourseFindManyArgs> = z.object({ select: CourseFindManySelectSchema.optional(), include: z.lazy(() => CourseIncludeObjectSchema.optional()), orderBy: z.union([CourseOrderByWithRelationInputObjectSchema, CourseOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseWhereInputObjectSchema.optional(), cursor: CourseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CourseScalarFieldEnumSchema, CourseScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CourseFindManyArgs>;

export const CourseFindManyZodSchema = z.object({ select: CourseFindManySelectSchema.optional(), include: z.lazy(() => CourseIncludeObjectSchema.optional()), orderBy: z.union([CourseOrderByWithRelationInputObjectSchema, CourseOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseWhereInputObjectSchema.optional(), cursor: CourseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CourseScalarFieldEnumSchema, CourseScalarFieldEnumSchema.array()]).optional() }).strict();