import * as z from 'zod';

export const CourseScalarFieldEnumSchema = z.enum(['name', 'categoryId', 'seq', 'active', 'startsAt', 'endsAt', 'repeat', 'frequency', 'roomId', 'isIgnoreCalendar', 'dates', 'seatsCurrent', 'seatsMax', 'paymentTypes', 'contractTypes', 'instructorId', 'textTermsId', 'textInfoId', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted', 'textId'])

export type CourseScalarFieldEnum = z.infer<typeof CourseScalarFieldEnumSchema>;