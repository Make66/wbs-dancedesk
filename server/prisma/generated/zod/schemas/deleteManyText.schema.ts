import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';

export const TextDeleteManySchema: z.ZodType<Prisma.TextDeleteManyArgs> = z.object({ where: TextWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TextDeleteManyArgs>;

export const TextDeleteManyZodSchema = z.object({ where: TextWhereInputObjectSchema.optional() }).strict();