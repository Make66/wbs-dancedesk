import * as z from 'zod';
// prettier-ignore
export const UserModelSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string(),
    password: z.string(),
    imageUrl: z.string(),
    modules: z.array(z.string()),
    active: z.boolean(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type UserPureType = z.infer<typeof UserModelSchema>;
