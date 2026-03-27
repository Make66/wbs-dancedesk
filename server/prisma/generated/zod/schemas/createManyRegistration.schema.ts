import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RegistrationCreateManyInputObjectSchema as RegistrationCreateManyInputObjectSchema } from './objects/RegistrationCreateManyInput.schema';

export const RegistrationCreateManySchema: z.ZodType<Prisma.RegistrationCreateManyArgs> = z.object({ data: z.union([ RegistrationCreateManyInputObjectSchema, z.array(RegistrationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RegistrationCreateManyArgs>;

export const RegistrationCreateManyZodSchema = z.object({ data: z.union([ RegistrationCreateManyInputObjectSchema, z.array(RegistrationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();