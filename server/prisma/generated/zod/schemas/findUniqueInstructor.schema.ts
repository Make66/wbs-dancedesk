import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './objects/InstructorInclude.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './objects/InstructorWhereUniqueInput.schema';

export const InstructorFindUniqueSchema: z.ZodType<Prisma.InstructorFindUniqueArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), where: InstructorWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InstructorFindUniqueArgs>;

export const InstructorFindUniqueZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), where: InstructorWhereUniqueInputObjectSchema }).strict();