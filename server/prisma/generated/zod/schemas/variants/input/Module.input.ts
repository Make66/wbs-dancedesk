import * as z from 'zod';
// prettier-ignore
export const ModuleInputSchema = z.object({
    name: z.string(),
    seq: z.number().int(),
    color: z.string(),
    active: z.boolean(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type ModuleInputType = z.infer<typeof ModuleInputSchema>;
