import { z } from 'zod/v4';

export const textSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.number().min(0),
  text: z.string(),

  // relations
  courseInfoId: z.uuid('Id given is not a valid UUID'),
  courseTermsId: z.uuid('Id given is not a valid UUID'),
  
  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID'),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false)
});

textSchema.partial({
  description: true,
  type: true,
  text: true,
  courseInfoId: true,
  courseTermsId: true,
  isActive: true,
  isDeleted: true,
  tenantId: true
});

export type Text = z.infer<typeof textSchema>;