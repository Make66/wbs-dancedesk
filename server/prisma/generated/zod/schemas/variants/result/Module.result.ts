import * as z from 'zod';
// prettier-ignore
export const ModuleResultSchema = z.object({
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

export type ModuleResultType = z.infer<typeof ModuleResultSchema>;
