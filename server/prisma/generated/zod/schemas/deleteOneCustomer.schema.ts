import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerDeleteOneSchema: z.ZodType<Prisma.CustomerDeleteArgs> = z.object({ select: CustomerSelectObjectSchema.optional(),  where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerDeleteArgs>;

export const CustomerDeleteOneZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(),  where: CustomerWhereUniqueInputObjectSchema }).strict();