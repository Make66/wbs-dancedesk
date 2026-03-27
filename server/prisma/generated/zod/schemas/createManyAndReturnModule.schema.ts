import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './objects/ModuleSelect.schema';
import { ModuleCreateManyInputObjectSchema as ModuleCreateManyInputObjectSchema } from './objects/ModuleCreateManyInput.schema';

export const ModuleCreateManyAndReturnSchema: z.ZodType<Prisma.ModuleCreateManyAndReturnArgs> = z.object({ select: ModuleSelectObjectSchema.optional(), data: z.union([ ModuleCreateManyInputObjectSchema, z.array(ModuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ModuleCreateManyAndReturnArgs>;

export const ModuleCreateManyAndReturnZodSchema = z.object({ select: ModuleSelectObjectSchema.optional(), data: z.union([ ModuleCreateManyInputObjectSchema, z.array(ModuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();