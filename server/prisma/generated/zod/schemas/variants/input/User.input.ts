import * as z from 'zod';
// prettier-ignore
export const UserInputSchema = z.object({
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
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

export type UserInputType = z.infer<typeof UserInputSchema>;
