import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { CourseUpdateManyWithoutTextTermsNestedInputObjectSchema as CourseUpdateManyWithoutTextTermsNestedInputObjectSchema } from './CourseUpdateManyWithoutTextTermsNestedInput.schema';
import { CourseUpdateManyWithoutTextNestedInputObjectSchema as CourseUpdateManyWithoutTextNestedInputObjectSchema } from './CourseUpdateManyWithoutTextNestedInput.schema'

const makeSchema = () => z.object({
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  text: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  tenantId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isDeleted: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  courseTerms: z.lazy(() => CourseUpdateManyWithoutTextTermsNestedInputObjectSchema).optional(),
  courses: z.lazy(() => CourseUpdateManyWithoutTextNestedInputObjectSchema).optional()
}).strict();
export const TextUpdateWithoutCourseInfoInputObjectSchema: z.ZodType<Prisma.TextUpdateWithoutCourseInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateWithoutCourseInfoInput>;
export const TextUpdateWithoutCourseInfoInputObjectZodSchema = makeSchema();
