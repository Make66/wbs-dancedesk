import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetOrderByWithRelationInputObjectSchema as TargetOrderByWithRelationInputObjectSchema } from './objects/TargetOrderByWithRelationInput.schema';
import { TargetWhereInputObjectSchema as TargetWhereInputObjectSchema } from './objects/TargetWhereInput.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';
import { TargetCountAggregateInputObjectSchema as TargetCountAggregateInputObjectSchema } from './objects/TargetCountAggregateInput.schema';

export const TargetCountSchema: z.ZodType<Prisma.TargetCountArgs> = z.object({ orderBy: z.union([TargetOrderByWithRelationInputObjectSchema, TargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: TargetWhereInputObjectSchema.optional(), cursor: TargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TargetCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TargetCountArgs>;

export const TargetCountZodSchema = z.object({ orderBy: z.union([TargetOrderByWithRelationInputObjectSchema, TargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: TargetWhereInputObjectSchema.optional(), cursor: TargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TargetCountAggregateInputObjectSchema ]).optional() }).strict();