import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const CourseCreatepaymentTypesInputObjectSchema: z.ZodType<Prisma.CourseCreatepaymentTypesInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreatepaymentTypesInput>;
export const CourseCreatepaymentTypesInputObjectZodSchema = makeSchema();
