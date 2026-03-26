import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8),
  imageUrl: z.string().optional(),
  modules: z.array(z.string()).default(["ALL"]), // Array of modules, e.g., ["COURSE", "SETTINGS", "ALL"]
  active: z.boolean().default(true),
});

export const signInSchema = userSchema.omit({ firstName: true, lastName: true });
