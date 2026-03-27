import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './objects/InstructorWhereInput.schema';

export const InstructorDeleteManySchema: z.ZodType<Prisma.InstructorDeleteManyArgs> = z.object({ where: InstructorWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InstructorDeleteManyArgs>;

export const InstructorDeleteManyZodSchema = z.object({ where: InstructorWhereInputObjectSchema.optional() }).strict();