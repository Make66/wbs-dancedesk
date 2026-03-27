import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './objects/InstructorInclude.schema';
import { InstructorUpdateInputObjectSchema as InstructorUpdateInputObjectSchema } from './objects/InstructorUpdateInput.schema';
import { InstructorUncheckedUpdateInputObjectSchema as InstructorUncheckedUpdateInputObjectSchema } from './objects/InstructorUncheckedUpdateInput.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './objects/InstructorWhereUniqueInput.schema';

export const InstructorUpdateOneSchema: z.ZodType<Prisma.InstructorUpdateArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), data: z.union([InstructorUpdateInputObjectSchema, InstructorUncheckedUpdateInputObjectSchema]), where: InstructorWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InstructorUpdateArgs>;

export const InstructorUpdateOneZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), data: z.union([InstructorUpdateInputObjectSchema, InstructorUncheckedUpdateInputObjectSchema]), where: InstructorWhereUniqueInputObjectSchema }).strict();