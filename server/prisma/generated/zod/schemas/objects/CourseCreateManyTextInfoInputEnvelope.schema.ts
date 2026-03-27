import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateManyTextInfoInputObjectSchema as CourseCreateManyTextInfoInputObjectSchema } from './CourseCreateManyTextInfoInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CourseCreateManyTextInfoInputObjectSchema), z.lazy(() => CourseCreateManyTextInfoInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseCreateManyTextInfoInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseCreateManyTextInfoInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateManyTextInfoInputEnvelope>;
export const CourseCreateManyTextInfoInputEnvelopeObjectZodSchema = makeSchema();
