import { z } from 'zod/v4';

export const textSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.number().min(0),
  text: z.string(),

  // relations
  courseInfoId: z.uuid('Id given is not a valid UUID').optional(),
  courseTermsId: z.uuid('Id given is not a valid UUID').optional(),
  
  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID').optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export type Text = z.infer<typeof textSchema>;