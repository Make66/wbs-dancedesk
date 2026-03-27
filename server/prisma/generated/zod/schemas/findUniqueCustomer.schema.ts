import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerFindUniqueSchema: z.ZodType<Prisma.CustomerFindUniqueArgs> = z.object({ select: CustomerSelectObjectSchema.optional(),  where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerFindUniqueArgs>;

export const CustomerFindUniqueZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(),  where: CustomerWhereUniqueInputObjectSchema }).strict();