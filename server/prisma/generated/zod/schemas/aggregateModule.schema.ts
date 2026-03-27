import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleOrderByWithRelationInputObjectSchema as ModuleOrderByWithRelationInputObjectSchema } from './objects/ModuleOrderByWithRelationInput.schema';
import { ModuleWhereInputObjectSchema as ModuleWhereInputObjectSchema } from './objects/ModuleWhereInput.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';
import { ModuleCountAggregateInputObjectSchema as ModuleCountAggregateInputObjectSchema } from './objects/ModuleCountAggregateInput.schema';
import { ModuleMinAggregateInputObjectSchema as ModuleMinAggregateInputObjectSchema } from './objects/ModuleMinAggregateInput.schema';
import { ModuleMaxAggregateInputObjectSchema as ModuleMaxAggregateInputObjectSchema } from './objects/ModuleMaxAggregateInput.schema';
import { ModuleAvgAggregateInputObjectSchema as ModuleAvgAggregateInputObjectSchema } from './objects/ModuleAvgAggregateInput.schema';
import { ModuleSumAggregateInputObjectSchema as ModuleSumAggregateInputObjectSchema } from './objects/ModuleSumAggregateInput.schema';

export const ModuleAggregateSchema: z.ZodType<Prisma.ModuleAggregateArgs> = z.object({ orderBy: z.union([ModuleOrderByWithRelationInputObjectSchema, ModuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ModuleWhereInputObjectSchema.optional(), cursor: ModuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ModuleCountAggregateInputObjectSchema ]).optional(), _min: ModuleMinAggregateInputObjectSchema.optional(), _max: ModuleMaxAggregateInputObjectSchema.optional(), _avg: ModuleAvgAggregateInputObjectSchema.optional(), _sum: ModuleSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ModuleAggregateArgs>;

export const ModuleAggregateZodSchema = z.object({ orderBy: z.union([ModuleOrderByWithRelationInputObjectSchema, ModuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ModuleWhereInputObjectSchema.optional(), cursor: ModuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ModuleCountAggregateInputObjectSchema ]).optional(), _min: ModuleMinAggregateInputObjectSchema.optional(), _max: ModuleMaxAggregateInputObjectSchema.optional(), _avg: ModuleAvgAggregateInputObjectSchema.optional(), _sum: ModuleSumAggregateInputObjectSchema.optional() }).strict();