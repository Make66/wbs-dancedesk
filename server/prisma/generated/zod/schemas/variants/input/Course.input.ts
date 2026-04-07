import * as z from "zod";
// prettier-ignore
export const CourseInputSchema = z.object({
    name: z.string().optional().nullable(),
    category: z.unknown(),
    categoryId: z.string(),
    seq: z.number().int(),
    active: z.boolean(),
    startsAt: z.date(),
    endsAt: z.date(),
    repeat: z.number().int(),
    frequency: z.string(),
    room: z.unknown().optional().nullable(),
    roomId: z.string().optional().nullable(),
    isIgnoreCalendar: z.boolean(),
    dates: z.unknown(),
    seatsCurrent: z.number().int(),
    seatsMax: z.number().int(),
    paymentTypes: z.array(z.string()),
    contractTypes: z.array(z.string()),
    instructor: z.unknown().optional().nullable(),
    instructorId: z.string().optional().nullable(),
    textTerms: z.unknown().optional().nullable(),
    textTermsId: z.string().optional().nullable(),
    textInfo: z.unknown().optional().nullable(),
    textInfoId: z.string().optional().nullable(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean(),
    text: z.unknown().optional().nullable(),
    textId: z.string().optional().nullable()
}).strict();

export type CourseInputType = z.infer<typeof CourseInputSchema>;
