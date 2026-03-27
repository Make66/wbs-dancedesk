import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomOrderByWithRelationInputObjectSchema as RoomOrderByWithRelationInputObjectSchema } from './objects/RoomOrderByWithRelationInput.schema';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomWhereUniqueInputObjectSchema as RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomCountAggregateInputObjectSchema as RoomCountAggregateInputObjectSchema } from './objects/RoomCountAggregateInput.schema';

export const RoomCountSchema: z.ZodType<Prisma.RoomCountArgs> = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.RoomCountArgs>;

export const RoomCountZodSchema = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional() }).strict();