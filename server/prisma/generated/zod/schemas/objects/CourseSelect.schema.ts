import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CategoryArgsObjectSchema as CategoryArgsObjectSchema } from './CategoryArgs.schema';
import { RoomArgsObjectSchema as RoomArgsObjectSchema } from './RoomArgs.schema';
import { InstructorArgsObjectSchema as InstructorArgsObjectSchema } from './InstructorArgs.schema';
import { TextArgsObjectSchema as TextArgsObjectSchema } from './TextArgs.schema'

const makeSchema = () => z.object({
  name: z.boolean().optional(),
  category: z.union([z.boolean(), z.lazy(() => CategoryArgsObjectSchema)]).optional(),
  categoryId: z.boolean().optional(),
  seq: z.boolean().optional(),
  active: z.boolean().optional(),
  startsAt: z.boolean().optional(),
  endsAt: z.boolean().optional(),
  repeat: z.boolean().optional(),
  frequency: z.boolean().optional(),
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional(),
  roomId: z.boolean().optional(),
  isIgnoreCalendar: z.boolean().optional(),
  dates: z.boolean().optional(),
  seatsCurrent: z.boolean().optional(),
  seatsMax: z.boolean().optional(),
  paymentTypes: z.boolean().optional(),
  contractTypes: z.boolean().optional(),
  instructor: z.union([z.boolean(), z.lazy(() => InstructorArgsObjectSchema)]).optional(),
  instructorId: z.boolean().optional(),
  textTerms: z.union([z.boolean(), z.lazy(() => TextArgsObjectSchema)]).optional(),
  textTermsId: z.boolean().optional(),
  textInfo: z.union([z.boolean(), z.lazy(() => TextArgsObjectSchema)]).optional(),
  textInfoId: z.boolean().optional(),
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  text: z.union([z.boolean(), z.lazy(() => TextArgsObjectSchema)]).optional(),
  textId: z.boolean().optional()
}).strict();
export const CourseSelectObjectSchema: z.ZodType<Prisma.CourseSelect> = makeSchema() as unknown as z.ZodType<Prisma.CourseSelect>;
export const CourseSelectObjectZodSchema = makeSchema();
