import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleCreateInputObjectSchema as ModuleCreateInputObjectSchema } from './objects/ModuleCreateInput.schema';
import { ModuleUncheckedCreateInputObjectSchema as ModuleUncheckedCreateInputObjectSchema } from './objects/ModuleUncheckedCreateInput.schema';

export const ModuleCreateOneSchema: z.ZodType<Prisma.ModuleCreateArgs> = z.object({ select: ModuleSelectObjectSchema.optional(),  data: z.union([ModuleCreateInputObjectSchema, ModuleUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ModuleCreateArgs>;

export const ModuleCreateOneZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(),  data: z.union([ModuleCreateInputObjectSchema, ModuleUncheckedCreateInputObjectSchema]) }).strict();