import * as z from 'zod';
// prettier-ignore
export const RegistrationInputSchema = z.object({
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
    longitude: z.number(),
    latitude: z.number(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type RegistrationInputType = z.infer<typeof RegistrationInputSchema>;
