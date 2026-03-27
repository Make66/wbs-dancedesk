import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RegistrationOrderByWithRelationInputObjectSchema as RegistrationOrderByWithRelationInputObjectSchema } from './objects/RegistrationOrderByWithRelationInput.schema';
import { RegistrationWhereInputObjectSchema as RegistrationWhereInputObjectSchema } from './objects/RegistrationWhereInput.schema';
import { RegistrationWhereUniqueInputObjectSchema as RegistrationWhereUniqueInputObjectSchema } from './objects/RegistrationWhereUniqueInput.schema';
import { RegistrationScalarFieldEnumSchema } from './enums/RegistrationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RegistrationFindFirstOrThrowSelectSchema: z.ZodType<Prisma.RegistrationSelect> = z.object({
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
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
  }).strict() as unknown as z.ZodType<Prisma.RegistrationSelect>;

export const RegistrationFindFirstOrThrowSelectZodSchema = z.object({
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
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

export const RegistrationFindFirstOrThrowSchema: z.ZodType<Prisma.RegistrationFindFirstOrThrowArgs> = z.object({ select: RegistrationFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([RegistrationOrderByWithRelationInputObjectSchema, RegistrationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RegistrationWhereInputObjectSchema.optional(), cursor: RegistrationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RegistrationScalarFieldEnumSchema, RegistrationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.RegistrationFindFirstOrThrowArgs>;

export const RegistrationFindFirstOrThrowZodSchema = z.object({ select: RegistrationFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([RegistrationOrderByWithRelationInputObjectSchema, RegistrationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RegistrationWhereInputObjectSchema.optional(), cursor: RegistrationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RegistrationScalarFieldEnumSchema, RegistrationScalarFieldEnumSchema.array()]).optional() }).strict();