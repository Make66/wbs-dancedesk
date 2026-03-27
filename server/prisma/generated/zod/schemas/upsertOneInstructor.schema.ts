import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './objects/InstructorSelect.schema';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './objects/InstructorInclude.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './objects/InstructorWhereUniqueInput.schema';
import { InstructorCreateInputObjectSchema as InstructorCreateInputObjectSchema } from './objects/InstructorCreateInput.schema';
import { InstructorUncheckedCreateInputObjectSchema as InstructorUncheckedCreateInputObjectSchema } from './objects/InstructorUncheckedCreateInput.schema';
import { InstructorUpdateInputObjectSchema as InstructorUpdateInputObjectSchema } from './objects/InstructorUpdateInput.schema';
import { InstructorUncheckedUpdateInputObjectSchema as InstructorUncheckedUpdateInputObjectSchema } from './objects/InstructorUncheckedUpdateInput.schema';

export const InstructorUpsertOneSchema: z.ZodType<Prisma.InstructorUpsertArgs> = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), where: InstructorWhereUniqueInputObjectSchema, create: z.union([ InstructorCreateInputObjectSchema, InstructorUncheckedCreateInputObjectSchema ]), update: z.union([ InstructorUpdateInputObjectSchema, InstructorUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.InstructorUpsertArgs>;

export const InstructorUpsertOneZodSchema = z.object({ select: InstructorSelectObjectSchema.optional(), include: InstructorIncludeObjectSchema.optional(), where: InstructorWhereUniqueInputObjectSchema, create: z.union([ InstructorCreateInputObjectSchema, InstructorUncheckedCreateInputObjectSchema ]), update: z.union([ InstructorUpdateInputObjectSchema, InstructorUncheckedUpdateInputObjectSchema ]) }).strict();