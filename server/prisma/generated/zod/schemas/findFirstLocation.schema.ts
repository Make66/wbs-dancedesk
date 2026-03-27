import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationOrderByWithRelationInputObjectSchema as LocationOrderByWithRelationInputObjectSchema } from './objects/LocationOrderByWithRelationInput.schema';
import { LocationWhereInputObjectSchema as LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';
import { LocationWhereUniqueInputObjectSchema as LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationScalarFieldEnumSchema } from './enums/LocationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LocationFindFirstSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
    name: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    seq: z.boolean().optional(),
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
  }).strict() as unknown as z.ZodType<Prisma.LocationSelect>;

export const LocationFindFirstSelectZodSchema = z.object({
    name: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    seq: z.boolean().optional(),
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

export const LocationFindFirstSchema: z.ZodType<Prisma.LocationFindFirstArgs> = z.object({ select: LocationFindFirstSelectSchema.optional(),  orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.LocationFindFirstArgs>;

export const LocationFindFirstZodSchema = z.object({ select: LocationFindFirstSelectSchema.optional(),  orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array()]).optional() }).strict();