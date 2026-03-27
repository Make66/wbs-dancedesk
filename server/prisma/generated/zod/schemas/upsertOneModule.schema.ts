import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleWhereUniqueInputObjectSchema as ModuleWhereUniqueInputObjectSchema } from './objects/ModuleWhereUniqueInput.schema';
import { ModuleCreateInputObjectSchema as ModuleCreateInputObjectSchema } from './objects/ModuleCreateInput.schema';
import { ModuleUncheckedCreateInputObjectSchema as ModuleUncheckedCreateInputObjectSchema } from './objects/ModuleUncheckedCreateInput.schema';
import { ModuleUpdateInputObjectSchema as ModuleUpdateInputObjectSchema } from './objects/ModuleUpdateInput.schema';
import { ModuleUncheckedUpdateInputObjectSchema as ModuleUncheckedUpdateInputObjectSchema } from './objects/ModuleUncheckedUpdateInput.schema';

export const ModuleUpsertOneSchema: z.ZodType<Prisma.ModuleUpsertArgs> = z.object({ select: ModuleSelectObjectSchema.optional(),  where: ModuleWhereUniqueInputObjectSchema, create: z.union([ ModuleCreateInputObjectSchema, ModuleUncheckedCreateInputObjectSchema ]), update: z.union([ ModuleUpdateInputObjectSchema, ModuleUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ModuleUpsertArgs>;

export const ModuleUpsertOneZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(),  where: ModuleWhereUniqueInputObjectSchema, create: z.union([ ModuleCreateInputObjectSchema, ModuleUncheckedCreateInputObjectSchema ]), update: z.union([ ModuleUpdateInputObjectSchema, ModuleUncheckedUpdateInputObjectSchema ]) }).strict();