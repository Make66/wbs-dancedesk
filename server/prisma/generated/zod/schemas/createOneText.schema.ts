import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './objects/TextSelect.schema';
import { TextIncludeObjectSchema as TextIncludeObjectSchema } from './objects/TextInclude.schema';
import { TextCreateInputObjectSchema as TextCreateInputObjectSchema } from './objects/TextCreateInput.schema';
import { TextUncheckedCreateInputObjectSchema as TextUncheckedCreateInputObjectSchema } from './objects/TextUncheckedCreateInput.schema';

export const TextCreateOneSchema: z.ZodType<Prisma.TextCreateArgs> = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), data: z.union([TextCreateInputObjectSchema, TextUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TextCreateArgs>;

export const TextCreateOneZodSchema = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), data: z.union([TextCreateInputObjectSchema, TextUncheckedCreateInputObjectSchema]) }).strict();