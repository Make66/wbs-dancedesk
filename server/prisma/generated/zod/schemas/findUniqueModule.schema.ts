import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';

export const ModuleFindUniqueSchema: z.ZodType<Prisma.ModuleFindUniqueArgs> = z.object({ select: ModuleSelectObjectSchema.optional(),  where: ModuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ModuleFindUniqueArgs>;

export const ModuleFindUniqueZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(),  where: ModuleWhereUniqueInputObjectSchema }).strict();