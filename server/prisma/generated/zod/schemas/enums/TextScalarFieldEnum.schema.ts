import * as z from 'zod';

export const TextScalarFieldEnumSchema = z.enum(['name', 'type', 'text', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type TextScalarFieldEnum = z.infer<typeof TextScalarFieldEnumSchema>;