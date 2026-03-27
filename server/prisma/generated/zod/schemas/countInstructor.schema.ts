import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorOrderByWithRelationInputObjectSchema as InstructorOrderByWithRelationInputObjectSchema } from './objects/InstructorOrderByWithRelationInput.schema';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './objects/InstructorWhereInput.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './objects/InstructorWhereUniqueInput.schema';
import { InstructorCountAggregateInputObjectSchema as InstructorCountAggregateInputObjectSchema } from './objects/InstructorCountAggregateInput.schema';

export const InstructorCountSchema: z.ZodType<Prisma.InstructorCountArgs> = z.object({ orderBy: z.union([InstructorOrderByWithRelationInputObjectSchema, InstructorOrderByWithRelationInputObjectSchema.array()]).optional(), where: InstructorWhereInputObjectSchema.optional(), cursor: InstructorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), InstructorCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.InstructorCountArgs>;

export const InstructorCountZodSchema = z.object({ orderBy: z.union([InstructorOrderByWithRelationInputObjectSchema, InstructorOrderByWithRelationInputObjectSchema.array()]).optional(), where: InstructorWhereInputObjectSchema.optional(), cursor: InstructorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), InstructorCountAggregateInputObjectSchema ]).optional() }).strict();