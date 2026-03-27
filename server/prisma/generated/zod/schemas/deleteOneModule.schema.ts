import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';

export const ModuleDeleteOneSchema: z.ZodType<Prisma.ModuleDeleteArgs> = z.object({ select: ModuleSelectObjectSchema.optional(),  where: ModuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ModuleDeleteArgs>;

export const ModuleDeleteOneZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(),  where: ModuleWhereUniqueInputObjectSchema }).strict();