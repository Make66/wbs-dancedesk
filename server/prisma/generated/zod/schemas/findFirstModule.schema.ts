import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleOrderByWithRelationInputObjectSchema as ModuleOrderByWithRelationInputObjectSchema } from './objects/ModuleOrderByWithRelationInput.schema';
import { ModuleWhereInputObjectSchema as ModuleWhereInputObjectSchema } from './objects/ModuleWhereInput.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';
import { ModuleScalarFieldEnumSchema } from './enums/ModuleScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ModuleFindFirstSelectSchema: z.ZodType<Prisma.ModuleSelect> = z.object({
    name: z.boolean().optional(),
    seq: z.boolean().optional(),
    color: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ModuleSelect>;

export const ModuleFindFirstSelectZodSchema = z.object({
    name: z.boolean().optional(),
    seq: z.boolean().optional(),
    color: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict();

export const ModuleFindFirstSchema: z.ZodType<Prisma.ModuleFindFirstArgs> = z.object({ select: ModuleFindFirstSelectSchema.optional(),  orderBy: z.union([ModuleOrderByWithRelationInputObjectSchema, ModuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ModuleWhereInputObjectSchema.optional(), cursor: ModuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ModuleScalarFieldEnumSchema, ModuleScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ModuleFindFirstArgs>;

export const ModuleFindFirstZodSchema = z.object({ select: ModuleFindFirstSelectSchema.optional(),  orderBy: z.union([ModuleOrderByWithRelationInputObjectSchema, ModuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ModuleWhereInputObjectSchema.optional(), cursor: ModuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ModuleScalarFieldEnumSchema, ModuleScalarFieldEnumSchema.array()]).optional() }).strict();