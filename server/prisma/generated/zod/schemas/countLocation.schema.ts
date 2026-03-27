import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationOrderByWithRelationInputObjectSchema as LocationOrderByWithRelationInputObjectSchema } from './objects/LocationOrderByWithRelationInput.schema';
import { LocationWhereInputObjectSchema as LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';
import { LocationWhereUniqueInputObjectSchema as LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationCountAggregateInputObjectSchema as LocationCountAggregateInputObjectSchema } from './objects/LocationCountAggregateInput.schema';

export const LocationCountSchema: z.ZodType<Prisma.LocationCountArgs> = z.object({ orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LocationCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.LocationCountArgs>;

export const LocationCountZodSchema = z.object({ orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LocationCountAggregateInputObjectSchema ]).optional() }).strict();