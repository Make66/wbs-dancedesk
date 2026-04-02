import { z } from "zod/v4";

export const targetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.array(z.string()).optional(), 
  
  locationId: z.uuid('Location ID must be a UUID'),
  setSeqCategory: z.array(z.uuid('Id given is not a valid UUID')).optional(),

  id: z.uuid('ID must be a UUID').optional(),
  tenantId: z.uuid('Tenant ID must be a UUID').optional(),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

targetSchema.partial({
  description: true,
  icon: true,
  color: true,
  setSeqCategory: true,
  isActive: true,
  isDeleted: true,
  tenantId: true
});

export type Target = z.infer<typeof targetSchema>;
