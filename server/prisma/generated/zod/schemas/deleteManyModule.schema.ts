import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleWhereInputObjectSchema as ModuleWhereInputObjectSchema } from './objects/ModuleWhereInput.schema';

export const ModuleDeleteManySchema: z.ZodType<Prisma.ModuleDeleteManyArgs> = z.object({ where: ModuleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ModuleDeleteManyArgs>;

export const ModuleDeleteManyZodSchema = z.object({ where: ModuleWhereInputObjectSchema.optional() }).strict();