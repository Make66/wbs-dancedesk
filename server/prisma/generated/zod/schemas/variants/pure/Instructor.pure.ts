import * as z from 'zod';
// prettier-ignore
export const InstructorModelSchema = z.object({
    name: z.string().nullable(),
    imageUrl: z.string(),
    active: z.boolean(),
    courses: z.array(z.unknown()),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type InstructorPureType = z.infer<typeof InstructorModelSchema>;
