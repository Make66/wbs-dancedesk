import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetUpdateInputObjectSchema as TargetUpdateInputObjectSchema } from './objects/TargetUpdateInput.schema';
import { TargetUncheckedUpdateInputObjectSchema as TargetUncheckedUpdateInputObjectSchema } from './objects/TargetUncheckedUpdateInput.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';

export const TargetUpdateOneSchema: z.ZodType<Prisma.TargetUpdateArgs> = z.object({ select: TargetSelectObjectSchema.optional(),  data: z.union([TargetUpdateInputObjectSchema, TargetUncheckedUpdateInputObjectSchema]), where: TargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TargetUpdateArgs>;

export const TargetUpdateOneZodSchema = z.object({ select: TargetSelectObjectSchema.optional(),  data: z.union([TargetUpdateInputObjectSchema, TargetUncheckedUpdateInputObjectSchema]), where: TargetWhereUniqueInputObjectSchema }).strict();