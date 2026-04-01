import { z } from "zod/v4";

export const targetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.array(z.string()).optional(),
  active: z.boolean().optional(),

  locationId: z.array(z.uuid()).optional(),
  setSeqCategory: z.array(z.uuid()).optional(),

  id: z.uuid().optional(),
  tenantId: z.uuid(),
  isDeleted: z.boolean().default(false),
});

targetSchema.partial({
  name: true,
  icon: true,
  color: true,
  active: true,
  setSeqCategory: true,
  isDeleted: true,
});

export type Target = z.infer<typeof targetSchema>;
