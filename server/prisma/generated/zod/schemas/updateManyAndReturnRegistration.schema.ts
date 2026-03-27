import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RegistrationSelectObjectSchema as RegistrationSelectObjectSchema } from './objects/RegistrationSelect.schema';
import { RegistrationUpdateManyMutationInputObjectSchema as RegistrationUpdateManyMutationInputObjectSchema } from './objects/RegistrationUpdateManyMutationInput.schema';
import { RegistrationWhereInputObjectSchema as RegistrationWhereInputObjectSchema } from './objects/RegistrationWhereInput.schema';

export const RegistrationUpdateManyAndReturnSchema: z.ZodType<Prisma.RegistrationUpdateManyAndReturnArgs> = z.object({ select: RegistrationSelectObjectSchema.optional(), data: RegistrationUpdateManyMutationInputObjectSchema, where: RegistrationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RegistrationUpdateManyAndReturnArgs>;

export const RegistrationUpdateManyAndReturnZodSchema = z.object({ select: RegistrationSelectObjectSchema.optional(), data: RegistrationUpdateManyMutationInputObjectSchema, where: RegistrationWhereInputObjectSchema.optional() }).strict();