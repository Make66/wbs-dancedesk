import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';
import { TextOrderByWithAggregationInputObjectSchema as TextOrderByWithAggregationInputObjectSchema } from './objects/TextOrderByWithAggregationInput.schema';
import { TextScalarWhereWithAggregatesInputObjectSchema as TextScalarWhereWithAggregatesInputObjectSchema } from './objects/TextScalarWhereWithAggregatesInput.schema';
import { TextScalarFieldEnumSchema } from './enums/TextScalarFieldEnum.schema';
import { TextCountAggregateInputObjectSchema as TextCountAggregateInputObjectSchema } from './objects/TextCountAggregateInput.schema';
import { TextMinAggregateInputObjectSchema as TextMinAggregateInputObjectSchema } from './objects/TextMinAggregateInput.schema';
import { TextMaxAggregateInputObjectSchema as TextMaxAggregateInputObjectSchema } from './objects/TextMaxAggregateInput.schema';
import { TextAvgAggregateInputObjectSchema as TextAvgAggregateInputObjectSchema } from './objects/TextAvgAggregateInput.schema';
import { TextSumAggregateInputObjectSchema as TextSumAggregateInputObjectSchema } from './objects/TextSumAggregateInput.schema';

export const TextGroupBySchema: z.ZodType<Prisma.TextGroupByArgs> = z.object({ where: TextWhereInputObjectSchema.optional(), orderBy: z.union([TextOrderByWithAggregationInputObjectSchema, TextOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TextScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TextScalarFieldEnumSchema), _count: z.union([ z.literal(true), TextCountAggregateInputObjectSchema ]).optional(), _min: TextMinAggregateInputObjectSchema.optional(), _max: TextMaxAggregateInputObjectSchema.optional(), _avg: TextAvgAggregateInputObjectSchema.optional(), _sum: TextSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TextGroupByArgs>;

export const TextGroupByZodSchema = z.object({ where: TextWhereInputObjectSchema.optional(), orderBy: z.union([TextOrderByWithAggregationInputObjectSchema, TextOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TextScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TextScalarFieldEnumSchema), _count: z.union([ z.literal(true), TextCountAggregateInputObjectSchema ]).optional(), _min: TextMinAggregateInputObjectSchema.optional(), _max: TextMaxAggregateInputObjectSchema.optional(), _avg: TextAvgAggregateInputObjectSchema.optional(), _sum: TextSumAggregateInputObjectSchema.optional() }).strict();