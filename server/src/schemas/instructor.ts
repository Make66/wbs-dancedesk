import { z } from 'zod/v4';

export const setSeqInstructorSchema = z.object({
  parent: z.uuid,
  instructors: z.array(z.uuid()),
});

export const instructorSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true)
});
