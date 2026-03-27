import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './objects/TextSelect.schema';
import { TextIncludeObjectSchema as TextIncludeObjectSchema } from './objects/TextInclude.schema';
import { TextUpdateInputObjectSchema as TextUpdateInputObjectSchema } from './objects/TextUpdateInput.schema';
import { TextUncheckedUpdateInputObjectSchema as TextUncheckedUpdateInputObjectSchema } from './objects/TextUncheckedUpdateInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './objects/TextWhereUniqueInput.schema';

export const TextUpdateOneSchema: z.ZodType<Prisma.TextUpdateArgs> = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), data: z.union([TextUpdateInputObjectSchema, TextUncheckedUpdateInputObjectSchema]), where: TextWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TextUpdateArgs>;

export const TextUpdateOneZodSchema = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), data: z.union([TextUpdateInputObjectSchema, TextUncheckedUpdateInputObjectSchema]), where: TextWhereUniqueInputObjectSchema }).strict();