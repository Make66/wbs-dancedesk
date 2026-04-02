import { z } from "zod/v4";

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  icon: z.string(),
  color: z.array(z.string()),
  
  targetId: z.uuid('Id given is not a valid UUID'),
  setSeqCourse: z.array(z.uuid('Id given is not a valid UUID')),

  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID'),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

categorySchema.partial({
  name: true,
  description: true,
  icon: true,
  color: true,
  
  setSeqCourse: true,
  isDeleted: true,
  tenantId: true,
});

export type Category = z.infer<typeof categorySchema>;
