import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleUpdateInputObjectSchema as ModuleUpdateInputObjectSchema } from './objects/ModuleUpdateInput.schema';
import { ModuleUncheckedUpdateInputObjectSchema as ModuleUncheckedUpdateInputObjectSchema } from './objects/ModuleUncheckedUpdateInput.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';

export const ModuleUpdateOneSchema: z.ZodType<Prisma.ModuleUpdateArgs> = z.object({ select: ModuleSelectObjectSchema.optional(),  data: z.union([ModuleUpdateInputObjectSchema, ModuleUncheckedUpdateInputObjectSchema]), where: ModuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ModuleUpdateArgs>;

export const ModuleUpdateOneZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(),  data: z.union([ModuleUpdateInputObjectSchema, ModuleUncheckedUpdateInputObjectSchema]), where: ModuleWhereUniqueInputObjectSchema }).strict();