import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerUpdateInputObjectSchema as CustomerUpdateInputObjectSchema } from './objects/CustomerUpdateInput.schema';
import { CustomerUncheckedUpdateInputObjectSchema as CustomerUncheckedUpdateInputObjectSchema } from './objects/CustomerUncheckedUpdateInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerUpdateOneSchema: z.ZodType<Prisma.CustomerUpdateArgs> = z.object({ select: CustomerSelectObjectSchema.optional(),  data: z.union([CustomerUpdateInputObjectSchema, CustomerUncheckedUpdateInputObjectSchema]), where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerUpdateArgs>;

export const CustomerUpdateOneZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(),  data: z.union([CustomerUpdateInputObjectSchema, CustomerUncheckedUpdateInputObjectSchema]), where: CustomerWhereUniqueInputObjectSchema }).strict();