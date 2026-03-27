import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './objects/InstructorInclude.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './objects/InstructorWhereUniqueInput.schema';

export const InstructorDeleteOneSchema: z.ZodType<Prisma.InstructorDeleteArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), where: InstructorWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InstructorDeleteArgs>;

export const InstructorDeleteOneZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), where: InstructorWhereUniqueInputObjectSchema }).strict();