import { z } from 'zod/v4';
import { setSeqCourseSchema } from './course.ts';

export const setSeqCategorySchema = z.object({
  parent: z.uuid(),
  categories: z.array(z.uuid()),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  target: z.uuid(),
  color: z.array(z.string()).default(['#000000', '#FFFFFF']),
  active: z.boolean().default(true),

  setSeqCourse: z.object({ setSeqCourseSchema }).optional(),
});
