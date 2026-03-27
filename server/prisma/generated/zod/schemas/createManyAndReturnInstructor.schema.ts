import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorCreateManyInputObjectSchema as InstructorCreateManyInputObjectSchema } from './objects/InstructorCreateManyInput.schema';

export const InstructorCreateManyAndReturnSchema: z.ZodType<Prisma.InstructorCreateManyAndReturnArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), data: z.union([ InstructorCreateManyInputObjectSchema, z.array(InstructorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.InstructorCreateManyAndReturnArgs>;

export const InstructorCreateManyAndReturnZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), data: z.union([ InstructorCreateManyInputObjectSchema, z.array(InstructorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();