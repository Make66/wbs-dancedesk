import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomOrderByWithAggregationInputObjectSchema as RoomOrderByWithAggregationInputObjectSchema } from './objects/RoomOrderByWithAggregationInput.schema';
import { RoomScalarWhereWithAggregatesInputObjectSchema as RoomScalarWhereWithAggregatesInputObjectSchema } from './objects/RoomScalarWhereWithAggregatesInput.schema';
import { RoomScalarFieldEnumSchema } from './enums/RoomScalarFieldEnum.schema';
import { RoomCountAggregateInputObjectSchema as RoomCountAggregateInputObjectSchema } from './objects/RoomCountAggregateInput.schema';
import { RoomMinAggregateInputObjectSchema as RoomMinAggregateInputObjectSchema } from './objects/RoomMinAggregateInput.schema';
import { RoomMaxAggregateInputObjectSchema as RoomMaxAggregateInputObjectSchema } from './objects/RoomMaxAggregateInput.schema';
import { RoomAvgAggregateInputObjectSchema as RoomAvgAggregateInputObjectSchema } from './objects/RoomAvgAggregateInput.schema';
import { RoomSumAggregateInputObjectSchema as RoomSumAggregateInputObjectSchema } from './objects/RoomSumAggregateInput.schema';

export const RoomGroupBySchema: z.ZodType<Prisma.RoomGroupByArgs> = z.object({ where: RoomWhereInputObjectSchema.optional(), orderBy: z.union([RoomOrderByWithAggregationInputObjectSchema, RoomOrderByWithAggregationInputObjectSchema.array()]).optional(), having: RoomScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(RoomScalarFieldEnumSchema), _count: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional(), _min: RoomMinAggregateInputObjectSchema.optional(), _max: RoomMaxAggregateInputObjectSchema.optional(), _avg: RoomAvgAggregateInputObjectSchema.optional(), _sum: RoomSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoomGroupByArgs>;

export const RoomGroupByZodSchema = z.object({ where: RoomWhereInputObjectSchema.optional(), orderBy: z.union([RoomOrderByWithAggregationInputObjectSchema, RoomOrderByWithAggregationInputObjectSchema.array()]).optional(), having: RoomScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(RoomScalarFieldEnumSchema), _count: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional(), _min: RoomMinAggregateInputObjectSchema.optional(), _max: RoomMaxAggregateInputObjectSchema.optional(), _avg: RoomAvgAggregateInputObjectSchema.optional(), _sum: RoomSumAggregateInputObjectSchema.optional() }).strict();