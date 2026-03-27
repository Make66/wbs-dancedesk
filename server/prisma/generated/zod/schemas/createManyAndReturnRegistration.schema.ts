import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RegistrationSelectObjectSchema as RegistrationSelectObjectSchema } from './objects/RegistrationSelect.schema';
import { RegistrationCreateManyInputObjectSchema as RegistrationCreateManyInputObjectSchema } from './objects/RegistrationCreateManyInput.schema';

export const RegistrationCreateManyAndReturnSchema: z.ZodType<Prisma.RegistrationCreateManyAndReturnArgs> = z.object({ select: RegistrationSelectObjectSchema.optional(), data: z.union([ RegistrationCreateManyInputObjectSchema, z.array(RegistrationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RegistrationCreateManyAndReturnArgs>;

export const RegistrationCreateManyAndReturnZodSchema = z.object({ select: RegistrationSelectObjectSchema.optional(), data: z.union([ RegistrationCreateManyInputObjectSchema, z.array(RegistrationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();