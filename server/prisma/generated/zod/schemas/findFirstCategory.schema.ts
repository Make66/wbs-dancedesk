import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CategoryIncludeObjectSchema as CategoryIncludeObjectSchema } from './objects/CategoryInclude.schema';
import { CategoryOrderByWithRelationInputObjectSchema as CategoryOrderByWithRelationInputObjectSchema } from './objects/CategoryOrderByWithRelationInput.schema';
import { CategoryWhereInputObjectSchema as CategoryWhereInputObjectSchema } from './objects/CategoryWhereInput.schema';
import { CategoryWhereUniqueInputObjectSchema as CategoryWhereUniqueInputObjectSchema } from './objects/CategoryWhereUniqueInput.schema';
import { CategoryScalarFieldEnumSchema } from './enums/CategoryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CategoryFindFirstSelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
    name: z.boolean().optional(),
    target: z.boolean().optional(),
    targetId: z.boolean().optional(),
    seq: z.boolean().optional(),
    color: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CategorySelect>;

export const CategoryFindFirstSelectZodSchema = z.object({
    name: z.boolean().optional(),
    target: z.boolean().optional(),
    targetId: z.boolean().optional(),
    seq: z.boolean().optional(),
    color: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict();

export const CategoryFindFirstSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({ select: CategoryFindFirstSelectSchema.optional(), include: z.lazy(() => CategoryIncludeObjectSchema.optional()), orderBy: z.union([CategoryOrderByWithRelationInputObjectSchema, CategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: CategoryWhereInputObjectSchema.optional(), cursor: CategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CategoryFindFirstArgs>;

export const CategoryFindFirstZodSchema = z.object({ select: CategoryFindFirstSelectSchema.optional(), include: z.lazy(() => CategoryIncludeObjectSchema.optional()), orderBy: z.union([CategoryOrderByWithRelationInputObjectSchema, CategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: CategoryWhereInputObjectSchema.optional(), cursor: CategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array()]).optional() }).strict();