import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextIncludeObjectSchema as TextIncludeObjectSchema } from './objects/TextInclude.schema';
import { TextOrderByWithRelationInputObjectSchema as TextOrderByWithRelationInputObjectSchema } from './objects/TextOrderByWithRelationInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './objects/TextWhereUniqueInput.schema';
import { TextScalarFieldEnumSchema } from './enums/TextScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TextFindFirstSelectSchema: z.ZodType<Prisma.TextSelect> = z.object({
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    text: z.boolean().optional(),
    courseTerms: z.boolean().optional(),
    courseInfo: z.boolean().optional(),
    courses: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TextSelect>;

export const TextFindFirstSelectZodSchema = z.object({
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    text: z.boolean().optional(),
    courseTerms: z.boolean().optional(),
    courseInfo: z.boolean().optional(),
    courses: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TextFindFirstSchema: z.ZodType<Prisma.TextFindFirstArgs> = z.object({ select: TextFindFirstSelectSchema.optional(), include: z.lazy(() => TextIncludeObjectSchema.optional()), orderBy: z.union([TextOrderByWithRelationInputObjectSchema, TextOrderByWithRelationInputObjectSchema.array()]).optional(), where: TextWhereInputObjectSchema.optional(), cursor: TextWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TextScalarFieldEnumSchema, TextScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TextFindFirstArgs>;

export const TextFindFirstZodSchema = z.object({ select: TextFindFirstSelectSchema.optional(), include: z.lazy(() => TextIncludeObjectSchema.optional()), orderBy: z.union([TextOrderByWithRelationInputObjectSchema, TextOrderByWithRelationInputObjectSchema.array()]).optional(), where: TextWhereInputObjectSchema.optional(), cursor: TextWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TextScalarFieldEnumSchema, TextScalarFieldEnumSchema.array()]).optional() }).strict();