import * as z from 'zod';

export const InstructorScalarFieldEnumSchema = z.enum(['name', 'imageUrl', 'active', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type InstructorScalarFieldEnum = z.infer<typeof InstructorScalarFieldEnumSchema>;