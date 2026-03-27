import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './objects/CustomerOrderByWithRelationInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';
import { CustomerScalarFieldEnumSchema } from './enums/CustomerScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CustomerFindFirstSelectSchema: z.ZodType<Prisma.CustomerSelect> = z.object({
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    website: z.boolean().optional(),
    logoUrl: z.boolean().optional(),
    primary: z.boolean().optional(),
    secondary: z.boolean().optional(),
    tertiary: z.boolean().optional(),
    quaternary: z.boolean().optional(),
    active: z.boolean().optional(),
    street: z.boolean().optional(),
    city: z.boolean().optional(),
    zipCode: z.boolean().optional(),
    longitude: z.boolean().optional(),
    latitude: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CustomerSelect>;

export const CustomerFindFirstSelectZodSchema = z.object({
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    website: z.boolean().optional(),
    logoUrl: z.boolean().optional(),
    primary: z.boolean().optional(),
    secondary: z.boolean().optional(),
    tertiary: z.boolean().optional(),
    quaternary: z.boolean().optional(),
    active: z.boolean().optional(),
    street: z.boolean().optional(),
    city: z.boolean().optional(),
    zipCode: z.boolean().optional(),
    longitude: z.boolean().optional(),
    latitude: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict();

export const CustomerFindFirstSchema: z.ZodType<Prisma.CustomerFindFirstArgs> = z.object({ select: CustomerFindFirstSelectSchema.optional(),  orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CustomerFindFirstArgs>;

export const CustomerFindFirstZodSchema = z.object({ select: CustomerFindFirstSelectSchema.optional(),  orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array()]).optional() }).strict();