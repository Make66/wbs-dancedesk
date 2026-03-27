import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './objects/InstructorInclude.schema';
import { InstructorOrderByWithRelationInputObjectSchema as InstructorOrderByWithRelationInputObjectSchema } from './objects/InstructorOrderByWithRelationInput.schema';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './objects/InstructorWhereInput.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './objects/InstructorWhereUniqueInput.schema';
import { InstructorScalarFieldEnumSchema } from './enums/InstructorScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const InstructorFindFirstOrThrowSelectSchema: z.ZodType<Prisma.InstructorSelect> = z.object({
    name: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    active: z.boolean().optional(),
    courses: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.InstructorSelect>;

export const InstructorFindFirstOrThrowSelectZodSchema = z.object({
    name: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    active: z.boolean().optional(),
    courses: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const InstructorFindFirstOrThrowSchema: z.ZodType<Prisma.InstructorFindFirstOrThrowArgs> = z.object({ select: InstructorFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => InstructorIncludeObjectSchema.optional()), orderBy: z.union([InstructorOrderByWithRelationInputObjectSchema, InstructorOrderByWithRelationInputObjectSchema.array()]).optional(), where: InstructorWhereInputObjectSchema.optional(), cursor: InstructorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([InstructorScalarFieldEnumSchema, InstructorScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.InstructorFindFirstOrThrowArgs>;

export const InstructorFindFirstOrThrowZodSchema = z.object({ select: InstructorFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => InstructorIncludeObjectSchema.optional()), orderBy: z.union([InstructorOrderByWithRelationInputObjectSchema, InstructorOrderByWithRelationInputObjectSchema.array()]).optional(), where: InstructorWhereInputObjectSchema.optional(), cursor: InstructorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([InstructorScalarFieldEnumSchema, InstructorScalarFieldEnumSchema.array()]).optional() }).strict();