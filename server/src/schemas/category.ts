import { z } from "zod/v4";

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  target: z.uuid(),
  color: z.array(z.string()).optional(),
  active: z.boolean().default(true),

  setSeqCourse: z.array(z.uuid()).optional(),

  id: z.uuid(),
  tenantId: z.uuid(),
  isDeleted: z.boolean().default(false),
});

categorySchema.partial({
  name: true,
  color: true,
  active: true,
  setSeqCourse: true,
  isDeleted: true,
});

export type Category = z.infer<typeof categorySchema>;
