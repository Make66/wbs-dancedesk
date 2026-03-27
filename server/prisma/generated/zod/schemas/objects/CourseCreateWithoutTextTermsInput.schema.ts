import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { CourseCreatepaymentTypesInputObjectSchema as CourseCreatepaymentTypesInputObjectSchema } from './CourseCreatepaymentTypesInput.schema';
import { CourseCreatecontractTypesInputObjectSchema as CourseCreatecontractTypesInputObjectSchema } from './CourseCreatecontractTypesInput.schema';
import { InstructorCreateNestedOneWithoutCoursesInputObjectSchema as InstructorCreateNestedOneWithoutCoursesInputObjectSchema } from './InstructorCreateNestedOneWithoutCoursesInput.schema';
import { TextCreateNestedOneWithoutCourseInfoInputObjectSchema as TextCreateNestedOneWithoutCourseInfoInputObjectSchema } from './TextCreateNestedOneWithoutCourseInfoInput.schema';
import { TextCreateNestedOneWithoutCoursesInputObjectSchema as TextCreateNestedOneWithoutCoursesInputObjectSchema } from './TextCreateNestedOneWithoutCoursesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  seq: z.number().int().optional(),
  active: z.boolean().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  repeat: z.number().int().optional(),
  frequency: z.string().optional(),
  isIgnoreCalendar: z.boolean().optional(),
  dates: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  seatsCurrent: z.number().int().optional(),
  seatsMax: z.number().int().optional(),
  paymentTypes: z.union([z.lazy(() => CourseCreatepaymentTypesInputObjectSchema), z.string().array()]).optional(),
  contractTypes: z.union([z.lazy(() => CourseCreatecontractTypesInputObjectSchema), z.string().array()]).optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  instructor: z.lazy(() => InstructorCreateNestedOneWithoutCoursesInputObjectSchema).optional(),
  textInfo: z.lazy(() => TextCreateNestedOneWithoutCourseInfoInputObjectSchema).optional(),
  text: z.lazy(() => TextCreateNestedOneWithoutCoursesInputObjectSchema).optional()
}).strict();
export const CourseCreateWithoutTextTermsInputObjectSchema: z.ZodType<Prisma.CourseCreateWithoutTextTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateWithoutTextTermsInput>;
export const CourseCreateWithoutTextTermsInputObjectZodSchema = makeSchema();
