import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerFindUniqueOrThrowSchema: z.ZodType<Prisma.CustomerFindUniqueOrThrowArgs> = z.object({ select: CustomerSelectObjectSchema.optional(),  where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerFindUniqueOrThrowArgs>;

export const CustomerFindUniqueOrThrowZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(),  where: CustomerWhereUniqueInputObjectSchema }).strict();