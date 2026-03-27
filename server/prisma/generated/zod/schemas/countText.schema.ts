import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextOrderByWithRelationInputObjectSchema as TextOrderByWithRelationInputObjectSchema } from './objects/TextOrderByWithRelationInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './objects/TextWhereUniqueInput.schema';
import { TextCountAggregateInputObjectSchema as TextCountAggregateInputObjectSchema } from './objects/TextCountAggregateInput.schema';

export const TextCountSchema: z.ZodType<Prisma.TextCountArgs> = z.object({ orderBy: z.union([TextOrderByWithRelationInputObjectSchema, TextOrderByWithRelationInputObjectSchema.array()]).optional(), where: TextWhereInputObjectSchema.optional(), cursor: TextWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TextCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TextCountArgs>;

export const TextCountZodSchema = z.object({ orderBy: z.union([TextOrderByWithRelationInputObjectSchema, TextOrderByWithRelationInputObjectSchema.array()]).optional(), where: TextWhereInputObjectSchema.optional(), cursor: TextWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TextCountAggregateInputObjectSchema ]).optional() }).strict();