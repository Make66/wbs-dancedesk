import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextOrderByWithRelationInputObjectSchema as TextOrderByWithRelationInputObjectSchema } from './objects/TextOrderByWithRelationInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './objects/TextWhereUniqueInput.schema';
import { TextCountAggregateInputObjectSchema as TextCountAggregateInputObjectSchema } from './objects/TextCountAggregateInput.schema';
import { TextMinAggregateInputObjectSchema as TextMinAggregateInputObjectSchema } from './objects/TextMinAggregateInput.schema';
import { TextMaxAggregateInputObjectSchema as TextMaxAggregateInputObjectSchema } from './objects/TextMaxAggregateInput.schema';
import { TextAvgAggregateInputObjectSchema as TextAvgAggregateInputObjectSchema } from './objects/TextAvgAggregateInput.schema';
import { TextSumAggregateInputObjectSchema as TextSumAggregateInputObjectSchema } from './objects/TextSumAggregateInput.schema';

export const TextAggregateSchema: z.ZodType<Prisma.TextAggregateArgs> = z.object({ orderBy: z.union([TextOrderByWithRelationInputObjectSchema, TextOrderByWithRelationInputObjectSchema.array()]).optional(), where: TextWhereInputObjectSchema.optional(), cursor: TextWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TextCountAggregateInputObjectSchema ]).optional(), _min: TextMinAggregateInputObjectSchema.optional(), _max: TextMaxAggregateInputObjectSchema.optional(), _avg: TextAvgAggregateInputObjectSchema.optional(), _sum: TextSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TextAggregateArgs>;

export const TextAggregateZodSchema = z.object({ orderBy: z.union([TextOrderByWithRelationInputObjectSchema, TextOrderByWithRelationInputObjectSchema.array()]).optional(), where: TextWhereInputObjectSchema.optional(), cursor: TextWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TextCountAggregateInputObjectSchema ]).optional(), _min: TextMinAggregateInputObjectSchema.optional(), _max: TextMaxAggregateInputObjectSchema.optional(), _avg: TextAvgAggregateInputObjectSchema.optional(), _sum: TextSumAggregateInputObjectSchema.optional() }).strict();