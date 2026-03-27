import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';

export const TargetDeleteOneSchema: z.ZodType<Prisma.TargetDeleteArgs> = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TargetDeleteArgs>;

export const TargetDeleteOneZodSchema = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema }).strict();