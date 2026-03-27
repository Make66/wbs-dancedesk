import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateManyInstructorInputObjectSchema as CourseCreateManyInstructorInputObjectSchema } from './CourseCreateManyInstructorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CourseCreateManyInstructorInputObjectSchema), z.lazy(() => CourseCreateManyInstructorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseCreateManyInstructorInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseCreateManyInstructorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateManyInstructorInputEnvelope>;
export const CourseCreateManyInstructorInputEnvelopeObjectZodSchema = makeSchema();
