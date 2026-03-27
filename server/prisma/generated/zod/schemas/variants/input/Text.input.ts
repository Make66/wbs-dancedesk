import * as z from 'zod';
// prettier-ignore
export const TextInputSchema = z.object({
    name: z.string().optional().nullable(),
    type: z.number().int(),
    text: z.string(),
    courseTerms: z.array(z.unknown()),
    courseInfo: z.array(z.unknown()),
    courses: z.array(z.unknown()),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type TextInputType = z.infer<typeof TextInputSchema>;
