import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CourseOrderByWithRelationInputObjectSchema as CourseOrderByWithRelationInputObjectSchema } from './objects/CourseOrderByWithRelationInput.schema';
import { CourseWhereInputObjectSchema as CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema';
import { CourseCountAggregateInputObjectSchema as CourseCountAggregateInputObjectSchema } from './objects/CourseCountAggregateInput.schema';
import { CourseMinAggregateInputObjectSchema as CourseMinAggregateInputObjectSchema } from './objects/CourseMinAggregateInput.schema';
import { CourseMaxAggregateInputObjectSchema as CourseMaxAggregateInputObjectSchema } from './objects/CourseMaxAggregateInput.schema';
import { CourseAvgAggregateInputObjectSchema as CourseAvgAggregateInputObjectSchema } from './objects/CourseAvgAggregateInput.schema';
import { CourseSumAggregateInputObjectSchema as CourseSumAggregateInputObjectSchema } from './objects/CourseSumAggregateInput.schema';

export const CourseAggregateSchema: z.ZodType<Prisma.CourseAggregateArgs> = z.object({ orderBy: z.union([CourseOrderByWithRelationInputObjectSchema, CourseOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseWhereInputObjectSchema.optional(), cursor: CourseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CourseCountAggregateInputObjectSchema ]).optional(), _min: CourseMinAggregateInputObjectSchema.optional(), _max: CourseMaxAggregateInputObjectSchema.optional(), _avg: CourseAvgAggregateInputObjectSchema.optional(), _sum: CourseSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CourseAggregateArgs>;

export const CourseAggregateZodSchema = z.object({ orderBy: z.union([CourseOrderByWithRelationInputObjectSchema, CourseOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseWhereInputObjectSchema.optional(), cursor: CourseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CourseCountAggregateInputObjectSchema ]).optional(), _min: CourseMinAggregateInputObjectSchema.optional(), _max: CourseMaxAggregateInputObjectSchema.optional(), _avg: CourseAvgAggregateInputObjectSchema.optional(), _sum: CourseSumAggregateInputObjectSchema.optional() }).strict();