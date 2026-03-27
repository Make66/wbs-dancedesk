import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const InstructorWhereUniqueInputObjectSchema: z.ZodType<Prisma.InstructorWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorWhereUniqueInput>;
export const InstructorWhereUniqueInputObjectZodSchema = makeSchema();
