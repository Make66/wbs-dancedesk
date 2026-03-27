import * as z from 'zod';

export const RegistrationScalarFieldEnumSchema = z.enum(['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'zipCode', 'longitude', 'latitude', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type RegistrationScalarFieldEnum = z.infer<typeof RegistrationScalarFieldEnumSchema>;