import * as z from 'zod';
// prettier-ignore
export const RegistrationModelSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
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

export type RegistrationPureType = z.infer<typeof RegistrationModelSchema>;
