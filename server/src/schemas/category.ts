import { z } from "zod/v4";

export const categorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional,
  icon: z.string().optional(),
  color: z.array(z.string()).optional(),
  
  targetId: z.uuid('Id given is not a valid UUID').optional(),
  setSeqCourse: z.array(z.uuid('Id given is not a valid UUID')).optional(),

  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export type Category = z.infer<typeof categorySchema>;
