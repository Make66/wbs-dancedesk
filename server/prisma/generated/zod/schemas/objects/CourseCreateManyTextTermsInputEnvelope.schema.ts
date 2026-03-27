import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateManyTextTermsInputObjectSchema as CourseCreateManyTextTermsInputObjectSchema } from './CourseCreateManyTextTermsInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CourseCreateManyTextTermsInputObjectSchema), z.lazy(() => CourseCreateManyTextTermsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseCreateManyTextTermsInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseCreateManyTextTermsInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateManyTextTermsInputEnvelope>;
export const CourseCreateManyTextTermsInputEnvelopeObjectZodSchema = makeSchema();
