import { z } from "zod/v4";

export const targetSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.array(z.string()).optional(), 
  
  locationId: z.uuid('Location ID must be a UUID').optional(),
  categories: z.array(z.uuid('Id given is not a valid UUID')).optional(),
  setSeqCategory: z.array(z.uuid('Id given is not a valid UUID')).optional(),

  id: z.uuid('ID must be a UUID'),
  tenantId: z.uuid('Tenant ID must be a UUID').optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export type Target = z.infer<typeof targetSchema>;
