import { z } from 'zod/v4';

export const moduleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default("#B5252B"),

  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID').optional(),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false)
});

moduleSchema.partial({
  description: true,
  color: true,
  isActive: true,
  isDeleted: true,
  tenantId: true
});

export type Module = z.infer<typeof moduleSchema>;