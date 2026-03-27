import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextUpdateManyMutationInputObjectSchema as TextUpdateManyMutationInputObjectSchema } from './objects/TextUpdateManyMutationInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';

export const TextUpdateManySchema: z.ZodType<Prisma.TextUpdateManyArgs> = z.object({ data: TextUpdateManyMutationInputObjectSchema, where: TextWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TextUpdateManyArgs>;

export const TextUpdateManyZodSchema = z.object({ data: TextUpdateManyMutationInputObjectSchema, where: TextWhereInputObjectSchema.optional() }).strict();