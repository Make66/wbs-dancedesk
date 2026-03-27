import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetWhereInputObjectSchema as TargetWhereInputObjectSchema } from './objects/TargetWhereInput.schema';

export const TargetDeleteManySchema: z.ZodType<Prisma.TargetDeleteManyArgs> = z.object({ where: TargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TargetDeleteManyArgs>;

export const TargetDeleteManyZodSchema = z.object({ where: TargetWhereInputObjectSchema.optional() }).strict();