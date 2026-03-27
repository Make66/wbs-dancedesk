import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleUpdateManyMutationInputObjectSchema as ModuleUpdateManyMutationInputObjectSchema } from './objects/ModuleUpdateManyMutationInput.schema';
import { ModuleWhereInputObjectSchema as ModuleWhereInputObjectSchema } from './objects/ModuleWhereInput.schema';

export const ModuleUpdateManyAndReturnSchema: z.ZodType<Prisma.ModuleUpdateManyAndReturnArgs> = z.object({ select: ModuleSelectObjectSchema.optional(), data: ModuleUpdateManyMutationInputObjectSchema, where: ModuleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ModuleUpdateManyAndReturnArgs>;

export const ModuleUpdateManyAndReturnZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(), data: ModuleUpdateManyMutationInputObjectSchema, where: ModuleWhereInputObjectSchema.optional() }).strict();