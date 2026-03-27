import * as z from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['firstName', 'lastName', 'email', 'password', 'imageUrl', 'modules', 'active', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;