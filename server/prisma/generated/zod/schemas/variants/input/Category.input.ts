import * as z from 'zod';
// prettier-ignore
export const CategoryInputSchema = z.object({
    name: z.string().optional().nullable(),
    target: z.unknown(),
    targetId: z.string(),
    seq: z.number().int(),
    color: z.array(z.string()),
    active: z.boolean(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type CategoryInputType = z.infer<typeof CategoryInputSchema>;
