import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateManyTextInputObjectSchema as CourseCreateManyTextInputObjectSchema } from './CourseCreateManyTextInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CourseCreateManyTextInputObjectSchema), z.lazy(() => CourseCreateManyTextInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseCreateManyTextInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseCreateManyTextInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateManyTextInputEnvelope>;
export const CourseCreateManyTextInputEnvelopeObjectZodSchema = makeSchema();
