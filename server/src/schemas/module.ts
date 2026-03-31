import { z } from 'zod/v4';

export const moduleSchema = z.object({
  name: z.string().min(1),
  color: z.string().default("#B5252B"),
  active: z.boolean().default(true),

  id: z.uuid(),
  tenantId: z.uuid()
});
