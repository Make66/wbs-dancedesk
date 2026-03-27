import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8),
  imageUrl: z.string().optional(),
  modules: z.array(z.string()).default(['ALL']),
  active: z.boolean().default(true),
});

export const registerSchema = userSchema
  .pick({ firstName: true, lastName: true, email: true, password: true })
  .extend({ tenantId: z.string().min(1) });

export const loginSchema = userSchema.pick({ email: true, password: true });

// kept for backward compatibility
export const signInSchema = loginSchema;
