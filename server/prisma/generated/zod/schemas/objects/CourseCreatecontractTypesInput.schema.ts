import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const CourseCreatecontractTypesInputObjectSchema: z.ZodType<Prisma.CourseCreatecontractTypesInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreatecontractTypesInput>;
export const CourseCreatecontractTypesInputObjectZodSchema = makeSchema();
