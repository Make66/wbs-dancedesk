import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TextWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TextWhereInputObjectSchema).optional().nullable()
}).strict();
export const TextNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TextNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TextNullableScalarRelationFilter>;
export const TextNullableScalarRelationFilterObjectZodSchema = makeSchema();
