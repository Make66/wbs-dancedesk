import * as z from 'zod';
// prettier-ignore
export const CourseModelSchema = z.object({
    name: z.string().nullable(),
    category: z.unknown(),
    categoryId: z.string(),
    seq: z.number().int(),
    active: z.boolean(),
    startsAt: z.date(),
    endsAt: z.date(),
    repeat: z.number().int(),
    frequency: z.string(),
    room: z.unknown().nullable(),
    roomId: z.string().nullable(),
    isIgnoreCalendar: z.boolean(),
    dates: z.unknown(),
    seatsCurrent: z.number().int(),
    seatsMax: z.number().int(),
    paymentTypes: z.array(z.string()),
    contractTypes: z.array(z.string()),
    instructor: z.unknown().nullable(),
    instructorId: z.string().nullable(),
    textTerms: z.unknown().nullable(),
    textTermsId: z.string().nullable(),
    textInfo: z.unknown().nullable(),
    textInfoId: z.string().nullable(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean(),
    text: z.unknown().nullable(),
    textId: z.string().nullable()
}).strict();

export type CoursePureType = z.infer<typeof CourseModelSchema>;
