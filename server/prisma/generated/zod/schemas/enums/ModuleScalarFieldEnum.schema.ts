import * as z from 'zod';

export const ModuleScalarFieldEnumSchema = z.enum(['name', 'seq', 'color', 'active', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type ModuleScalarFieldEnum = z.infer<typeof ModuleScalarFieldEnumSchema>;