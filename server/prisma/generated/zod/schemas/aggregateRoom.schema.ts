import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomOrderByWithRelationInputObjectSchema as RoomOrderByWithRelationInputObjectSchema } from './objects/RoomOrderByWithRelationInput.schema';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomWhereUniqueInputObjectSchema as RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomCountAggregateInputObjectSchema as RoomCountAggregateInputObjectSchema } from './objects/RoomCountAggregateInput.schema';
import { RoomMinAggregateInputObjectSchema as RoomMinAggregateInputObjectSchema } from './objects/RoomMinAggregateInput.schema';
import { RoomMaxAggregateInputObjectSchema as RoomMaxAggregateInputObjectSchema } from './objects/RoomMaxAggregateInput.schema';
import { RoomAvgAggregateInputObjectSchema as RoomAvgAggregateInputObjectSchema } from './objects/RoomAvgAggregateInput.schema';
import { RoomSumAggregateInputObjectSchema as RoomSumAggregateInputObjectSchema } from './objects/RoomSumAggregateInput.schema';

export const RoomAggregateSchema: z.ZodType<Prisma.RoomAggregateArgs> = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional(), _min: RoomMinAggregateInputObjectSchema.optional(), _max: RoomMaxAggregateInputObjectSchema.optional(), _avg: RoomAvgAggregateInputObjectSchema.optional(), _sum: RoomSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoomAggregateArgs>;

export const RoomAggregateZodSchema = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional(), _min: RoomMinAggregateInputObjectSchema.optional(), _max: RoomMaxAggregateInputObjectSchema.optional(), _avg: RoomAvgAggregateInputObjectSchema.optional(), _sum: RoomSumAggregateInputObjectSchema.optional() }).strict();