import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleOrderByWithRelationInputObjectSchema as ModuleOrderByWithRelationInputObjectSchema } from './objects/ModuleOrderByWithRelationInput.schema';
import { ModuleWhereInputObjectSchema as ModuleWhereInputObjectSchema } from './objects/ModuleWhereInput.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';
import { ModuleCountAggregateInputObjectSchema as ModuleCountAggregateInputObjectSchema } from './objects/ModuleCountAggregateInput.schema';

export const ModuleCountSchema: z.ZodType<Prisma.ModuleCountArgs> = z.object({ orderBy: z.union([ModuleOrderByWithRelationInputObjectSchema, ModuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ModuleWhereInputObjectSchema.optional(), cursor: ModuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ModuleCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ModuleCountArgs>;

export const ModuleCountZodSchema = z.object({ orderBy: z.union([ModuleOrderByWithRelationInputObjectSchema, ModuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ModuleWhereInputObjectSchema.optional(), cursor: ModuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ModuleCountAggregateInputObjectSchema ]).optional() }).strict();