import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { CourseUpdatepaymentTypesInputObjectSchema as CourseUpdatepaymentTypesInputObjectSchema } from './CourseUpdatepaymentTypesInput.schema';
import { CourseUpdatecontractTypesInputObjectSchema as CourseUpdatecontractTypesInputObjectSchema } from './CourseUpdatecontractTypesInput.schema';
import { TextUpdateOneWithoutCourseTermsNestedInputObjectSchema as TextUpdateOneWithoutCourseTermsNestedInputObjectSchema } from './TextUpdateOneWithoutCourseTermsNestedInput.schema';
import { TextUpdateOneWithoutCourseInfoNestedInputObjectSchema as TextUpdateOneWithoutCourseInfoNestedInputObjectSchema } from './TextUpdateOneWithoutCourseInfoNestedInput.schema';
import { TextUpdateOneWithoutCoursesNestedInputObjectSchema as TextUpdateOneWithoutCoursesNestedInputObjectSchema } from './TextUpdateOneWithoutCoursesNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  seq: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  active: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  startsAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endsAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  repeat: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  frequency: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  isIgnoreCalendar: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  dates: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  seatsCurrent: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  seatsMax: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  paymentTypes: z.union([z.lazy(() => CourseUpdatepaymentTypesInputObjectSchema), z.string().array()]).optional(),
  contractTypes: z.union([z.lazy(() => CourseUpdatecontractTypesInputObjectSchema), z.string().array()]).optional(),
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  tenantId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isDeleted: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  textTerms: z.lazy(() => TextUpdateOneWithoutCourseTermsNestedInputObjectSchema).optional(),
  textInfo: z.lazy(() => TextUpdateOneWithoutCourseInfoNestedInputObjectSchema).optional(),
  text: z.lazy(() => TextUpdateOneWithoutCoursesNestedInputObjectSchema).optional()
}).strict();
export const CourseUpdateWithoutInstructorInputObjectSchema: z.ZodType<Prisma.CourseUpdateWithoutInstructorInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateWithoutInstructorInput>;
export const CourseUpdateWithoutInstructorInputObjectZodSchema = makeSchema();
