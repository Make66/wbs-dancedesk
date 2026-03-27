import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './InstructorWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => InstructorWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => InstructorWhereInputObjectSchema).optional().nullable()
}).strict();
export const InstructorNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.InstructorNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.InstructorNullableScalarRelationFilter>;
export const InstructorNullableScalarRelationFilterObjectZodSchema = makeSchema();
