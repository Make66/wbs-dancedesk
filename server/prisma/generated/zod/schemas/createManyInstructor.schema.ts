import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorCreateManyInputObjectSchema as InstructorCreateManyInputObjectSchema } from './objects/InstructorCreateManyInput.schema';

export const InstructorCreateManySchema: z.ZodType<Prisma.InstructorCreateManyArgs> = z.object({ data: z.union([ InstructorCreateManyInputObjectSchema, z.array(InstructorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.InstructorCreateManyArgs>;

export const InstructorCreateManyZodSchema = z.object({ data: z.union([ InstructorCreateManyInputObjectSchema, z.array(InstructorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();