import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetCreateInputObjectSchema as TargetCreateInputObjectSchema } from './objects/TargetCreateInput.schema';
import { TargetUncheckedCreateInputObjectSchema as TargetUncheckedCreateInputObjectSchema } from './objects/TargetUncheckedCreateInput.schema';

export const TargetCreateOneSchema: z.ZodType<Prisma.TargetCreateArgs> = z.object({ select: TargetSelectObjectSchema.optional(),  data: z.union([TargetCreateInputObjectSchema, TargetUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TargetCreateArgs>;

export const TargetCreateOneZodSchema = z.object({ select: TargetSelectObjectSchema.optional(),  data: z.union([TargetCreateInputObjectSchema, TargetUncheckedCreateInputObjectSchema]) }).strict();