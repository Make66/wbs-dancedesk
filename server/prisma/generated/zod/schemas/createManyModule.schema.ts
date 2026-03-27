import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { ModuleCreateManyInputObjectSchema as ModuleCreateManyInputObjectSchema } from './objects/ModuleCreateManyInput.schema';

export const ModuleCreateManySchema: z.ZodType<Prisma.ModuleCreateManyArgs> = z.object({ data: z.union([ ModuleCreateManyInputObjectSchema, z.array(ModuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ModuleCreateManyArgs>;

export const ModuleCreateManyZodSchema = z.object({ data: z.union([ ModuleCreateManyInputObjectSchema, z.array(ModuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();