import { z } from 'zod/v4';

export const instructorSchema = z.object({
  name: z.string().min(1).optional,
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  skills: z.array(z.string()).default([]).optional(),

  id: z.uuid('Id given is not a valid UUID').optional(),
  customerId: z.uuid('Customer ID must be a UUID').optional(),
  tenantId: z.uuid('Id given is not a valid UUID').optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Instructor = z.infer<typeof instructorSchema>;