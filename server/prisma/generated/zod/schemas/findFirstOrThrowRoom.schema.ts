import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomOrderByWithRelationInputObjectSchema as RoomOrderByWithRelationInputObjectSchema } from './objects/RoomOrderByWithRelationInput.schema';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomWhereUniqueInputObjectSchema as RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomScalarFieldEnumSchema } from './enums/RoomScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RoomFindFirstOrThrowSelectSchema: z.ZodType<Prisma.RoomSelect> = z.object({
    name: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    capacity: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.RoomSelect>;

export const RoomFindFirstOrThrowSelectZodSchema = z.object({
    name: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    capacity: z.boolean().optional(),
    active: z.boolean().optional(),
    id: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    isDeleted: z.boolean().optional()
  }).strict();

export const RoomFindFirstOrThrowSchema: z.ZodType<Prisma.RoomFindFirstOrThrowArgs> = z.object({ select: RoomFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.RoomFindFirstOrThrowArgs>;

export const RoomFindFirstOrThrowZodSchema = z.object({ select: RoomFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array()]).optional() }).strict();