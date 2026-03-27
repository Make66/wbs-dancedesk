import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleUpdateManyMutationInputObjectSchema as ModuleUpdateManyMutationInputObjectSchema } from './objects/ModuleUpdateManyMutationInput.schema';
import { ModuleWhereInputObjectSchema as ModuleWhereInputObjectSchema } from './objects/ModuleWhereInput.schema';

export const ModuleUpdateManySchema: z.ZodType<Prisma.ModuleUpdateManyArgs> = z.object({ data: ModuleUpdateManyMutationInputObjectSchema, where: ModuleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ModuleUpdateManyArgs>;

export const ModuleUpdateManyZodSchema = z.object({ data: ModuleUpdateManyMutationInputObjectSchema, where: ModuleWhereInputObjectSchema.optional() }).strict();