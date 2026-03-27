import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RegistrationSelectObjectSchema as RegistrationSelectObjectSchema } from './objects/RegistrationSelect.schema';
import { RegistrationWhereUniqueInputObjectSchema as RegistrationWhereUniqueInputObjectSchema } from './objects/RegistrationWhereUniqueInput.schema';

export const RegistrationDeleteOneSchema: z.ZodType<Prisma.RegistrationDeleteArgs> = z.object({ select: RegistrationSelectObjectSchema.optional(),  where: RegistrationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RegistrationDeleteArgs>;

export const RegistrationDeleteOneZodSchema = z.object({ select: RegistrationSelectObjectSchema.optional(),  where: RegistrationWhereUniqueInputObjectSchema }).strict();