import { z } from 'zod/v4';

export const courseTreeSchema = z.object({
  location: z.uuid(),
  target: z.array(z.uuid()),


});



