import * as z from 'zod';
// prettier-ignore
export const TargetInputSchema = z.object({
    name: z.string().optional().nullable(),
    icon: z.string(),
    seq: z.number().int(),
    color: z.array(z.string()),
    active: z.boolean(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type TargetInputType = z.infer<typeof TargetInputSchema>;
