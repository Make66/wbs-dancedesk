import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const CourseWhereUniqueInputObjectSchema: z.ZodType<Prisma.CourseWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseWhereUniqueInput>;
export const CourseWhereUniqueInputObjectZodSchema = makeSchema();
