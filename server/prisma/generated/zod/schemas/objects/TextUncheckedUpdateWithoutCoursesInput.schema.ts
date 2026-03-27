import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { CourseUncheckedUpdateManyWithoutTextTermsNestedInputObjectSchema as CourseUncheckedUpdateManyWithoutTextTermsNestedInputObjectSchema } from './CourseUncheckedUpdateManyWithoutTextTermsNestedInput.schema';
import { CourseUncheckedUpdateManyWithoutTextInfoNestedInputObjectSchema as CourseUncheckedUpdateManyWithoutTextInfoNestedInputObjectSchema } from './CourseUncheckedUpdateManyWithoutTextInfoNestedInput.schema'

const makeSchema = () => z.object({
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  text: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  tenantId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isDeleted: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  courseTerms: z.lazy(() => CourseUncheckedUpdateManyWithoutTextTermsNestedInputObjectSchema).optional(),
  courseInfo: z.lazy(() => CourseUncheckedUpdateManyWithoutTextInfoNestedInputObjectSchema).optional()
}).strict();
export const TextUncheckedUpdateWithoutCoursesInputObjectSchema: z.ZodType<Prisma.TextUncheckedUpdateWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUncheckedUpdateWithoutCoursesInput>;
export const TextUncheckedUpdateWithoutCoursesInputObjectZodSchema = makeSchema();
