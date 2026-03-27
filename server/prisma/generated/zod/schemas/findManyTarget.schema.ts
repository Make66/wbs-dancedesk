import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetOrderByWithRelationInputObjectSchema as TargetOrderByWithRelationInputObjectSchema } from './objects/TargetOrderByWithRelationInput.schema';
import { TargetWhereInputObjectSchema as TargetWhereInputObjectSchema } from './objects/TargetWhereInput.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';
import { TargetScalarFieldEnumSchema } from './enums/TargetScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TargetFindManySelectSchema: z.ZodType<Prisma.TargetSelect> = z.object({
    name: z.boolean().optional(),
    icon: z.boolean().optional(),
    seq: z.boolean().optional(),
    color: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TargetSelect>;

export const TargetFindManySelectZodSchema = z.object({
    name: z.boolean().optional(),
    icon: z.boolean().optional(),
    seq: z.boolean().optional(),
    color: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict();

export const TargetFindManySchema: z.ZodType<Prisma.TargetFindManyArgs> = z.object({ select: TargetFindManySelectSchema.optional(),  orderBy: z.union([TargetOrderByWithRelationInputObjectSchema, TargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: TargetWhereInputObjectSchema.optional(), cursor: TargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TargetScalarFieldEnumSchema, TargetScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TargetFindManyArgs>;

export const TargetFindManyZodSchema = z.object({ select: TargetFindManySelectSchema.optional(),  orderBy: z.union([TargetOrderByWithRelationInputObjectSchema, TargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: TargetWhereInputObjectSchema.optional(), cursor: TargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TargetScalarFieldEnumSchema, TargetScalarFieldEnumSchema.array()]).optional() }).strict();