import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseOrderByWithRelationInputObjectSchema as CourseOrderByWithRelationInputObjectSchema } from './objects/CourseOrderByWithRelationInput.schema';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema';
import { CourseCountAggregateInputObjectSchema as CourseCountAggregateInputObjectSchema } from './objects/CourseCountAggregateInput.schema';

export const CourseCountSchema: z.ZodType<Prisma.CourseCountArgs> = z.object({ orderBy: z.union([CourseOrderByWithRelationInputObjectSchema, CourseOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseWhereInputObjectSchema.optional(), cursor: CourseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CourseCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CourseCountArgs>;

export const CourseCountZodSchema = z.object({ orderBy: z.union([CourseOrderByWithRelationInputObjectSchema, CourseOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseWhereInputObjectSchema.optional(), cursor: CourseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CourseCountAggregateInputObjectSchema ]).optional() }).strict();