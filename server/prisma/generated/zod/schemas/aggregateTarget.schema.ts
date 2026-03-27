import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetOrderByWithRelationInputObjectSchema as TargetOrderByWithRelationInputObjectSchema } from './objects/TargetOrderByWithRelationInput.schema';
import { TargetWhereInputObjectSchema as TargetWhereInputObjectSchema } from './objects/TargetWhereInput.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';
import { TargetCountAggregateInputObjectSchema as TargetCountAggregateInputObjectSchema } from './objects/TargetCountAggregateInput.schema';
import { TargetMinAggregateInputObjectSchema as TargetMinAggregateInputObjectSchema } from './objects/TargetMinAggregateInput.schema';
import { TargetMaxAggregateInputObjectSchema as TargetMaxAggregateInputObjectSchema } from './objects/TargetMaxAggregateInput.schema';
import { TargetAvgAggregateInputObjectSchema as TargetAvgAggregateInputObjectSchema } from './objects/TargetAvgAggregateInput.schema';
import { TargetSumAggregateInputObjectSchema as TargetSumAggregateInputObjectSchema } from './objects/TargetSumAggregateInput.schema';

export const TargetAggregateSchema: z.ZodType<Prisma.TargetAggregateArgs> = z.object({ orderBy: z.union([TargetOrderByWithRelationInputObjectSchema, TargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: TargetWhereInputObjectSchema.optional(), cursor: TargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TargetCountAggregateInputObjectSchema ]).optional(), _min: TargetMinAggregateInputObjectSchema.optional(), _max: TargetMaxAggregateInputObjectSchema.optional(), _avg: TargetAvgAggregateInputObjectSchema.optional(), _sum: TargetSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TargetAggregateArgs>;

export const TargetAggregateZodSchema = z.object({ orderBy: z.union([TargetOrderByWithRelationInputObjectSchema, TargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: TargetWhereInputObjectSchema.optional(), cursor: TargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TargetCountAggregateInputObjectSchema ]).optional(), _min: TargetMinAggregateInputObjectSchema.optional(), _max: TargetMaxAggregateInputObjectSchema.optional(), _avg: TargetAvgAggregateInputObjectSchema.optional(), _sum: TargetSumAggregateInputObjectSchema.optional() }).strict();