import { z } from 'zod/v4';

export const moduleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default("#B5252B"),
  active: z.boolean().default(true),

  id: z.uuid(),
  tenantId: z.uuid().optional(),
  isDeleted: z.boolean().default(false)
});

moduleSchema.partial({
  name: true,
  color: true,
  active: true,
  isDeleted: true,
});

export type Module = z.infer<typeof moduleSchema>;