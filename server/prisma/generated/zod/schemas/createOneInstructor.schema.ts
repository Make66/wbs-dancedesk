import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './objects/InstructorInclude.schema';
import { InstructorCreateInputObjectSchema as InstructorCreateInputObjectSchema } from './objects/InstructorCreateInput.schema';
import { InstructorUncheckedCreateInputObjectSchema as InstructorUncheckedCreateInputObjectSchema } from './objects/InstructorUncheckedCreateInput.schema';

export const InstructorCreateOneSchema: z.ZodType<Prisma.InstructorCreateArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), data: z.union([InstructorCreateInputObjectSchema, InstructorUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.InstructorCreateArgs>;

export const InstructorCreateOneZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), data: z.union([InstructorCreateInputObjectSchema, InstructorUncheckedCreateInputObjectSchema]) }).strict();