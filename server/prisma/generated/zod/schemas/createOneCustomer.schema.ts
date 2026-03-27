import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerCreateInputObjectSchema as CustomerCreateInputObjectSchema } from './objects/CustomerCreateInput.schema';
import { CustomerUncheckedCreateInputObjectSchema as CustomerUncheckedCreateInputObjectSchema } from './objects/CustomerUncheckedCreateInput.schema';

export const CustomerCreateOneSchema: z.ZodType<Prisma.CustomerCreateArgs> = z.object({ select: CustomerSelectObjectSchema.optional(),  data: z.union([CustomerCreateInputObjectSchema, CustomerUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CustomerCreateArgs>;

export const CustomerCreateOneZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(),  data: z.union([CustomerCreateInputObjectSchema, CustomerUncheckedCreateInputObjectSchema]) }).strict();