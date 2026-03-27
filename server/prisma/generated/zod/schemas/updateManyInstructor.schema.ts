import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorUpdateManyMutationInputObjectSchema as InstructorUpdateManyMutationInputObjectSchema } from './objects/InstructorUpdateManyMutationInput.schema';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './objects/InstructorWhereInput.schema';

export const InstructorUpdateManySchema: z.ZodType<Prisma.InstructorUpdateManyArgs> = z.object({ data: InstructorUpdateManyMutationInputObjectSchema, where: InstructorWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InstructorUpdateManyArgs>;

export const InstructorUpdateManyZodSchema = z.object({ data: InstructorUpdateManyMutationInputObjectSchema, where: InstructorWhereInputObjectSchema.optional() }).strict();