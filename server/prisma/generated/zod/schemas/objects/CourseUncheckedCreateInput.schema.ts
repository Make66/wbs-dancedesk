import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { CourseCreatepaymentTypesInputObjectSchema as CourseCreatepaymentTypesInputObjectSchema } from './CourseCreatepaymentTypesInput.schema';
import { CourseCreatecontractTypesInputObjectSchema as CourseCreatecontractTypesInputObjectSchema } from './CourseCreatecontractTypesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  categoryId: z.string(),
  seq: z.number().int().optional(),
  active: z.boolean().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  repeat: z.number().int().optional(),
  frequency: z.string().optional(),
  roomId: z.string().optional().nullable(),
  isIgnoreCalendar: z.boolean().optional(),
  dates: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  seatsCurrent: z.number().int().optional(),
  seatsMax: z.number().int().optional(),
  paymentTypes: z.union([z.lazy(() => CourseCreatepaymentTypesInputObjectSchema), z.string().array()]).optional(),
  contractTypes: z.union([z.lazy(() => CourseCreatecontractTypesInputObjectSchema), z.string().array()]).optional(),
  instructorId: z.string().optional().nullable(),
  textTermsId: z.string().optional().nullable(),
  textInfoId: z.string().optional().nullable(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  textId: z.string().optional().nullable()
}).strict();
export const CourseUncheckedCreateInputObjectSchema: z.ZodType<Prisma.CourseUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUncheckedCreateInput>;
export const CourseUncheckedCreateInputObjectZodSchema = makeSchema();
