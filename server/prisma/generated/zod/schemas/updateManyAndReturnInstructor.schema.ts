import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorUpdateManyMutationInputObjectSchema as InstructorUpdateManyMutationInputObjectSchema } from './objects/InstructorUpdateManyMutationInput.schema';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './objects/InstructorWhereInput.schema';

export const InstructorUpdateManyAndReturnSchema: z.ZodType<Prisma.InstructorUpdateManyAndReturnArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), data: InstructorUpdateManyMutationInputObjectSchema, where: InstructorWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InstructorUpdateManyAndReturnArgs>;

export const InstructorUpdateManyAndReturnZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), data: InstructorUpdateManyMutationInputObjectSchema, where: InstructorWhereInputObjectSchema.optional() }).strict();