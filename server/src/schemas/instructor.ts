import { z } from 'zod/v4';

export const instructorSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  skills: z.array(z.string()).default([]),

  id: z.uuid('Id given is not a valid UUID').optional(),
  customerId: z.uuid('Customer ID must be a UUID'),
  tenantId: z.uuid('Id given is not a valid UUID').optional(),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false)
});

instructorSchema.partial({
  description: true,
  imageUrl: true,
  skills: true,
  isDeleted: true,
  isActive: true,
  tenantId: true,
});

export type Instructor = z.infer<typeof instructorSchema>;