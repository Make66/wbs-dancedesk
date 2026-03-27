import { signInSchema, userSchema } from '#schemas';
import type { z } from 'zod/v4';

declare global {
  type UserRequestBody = z.infer<typeof userSchema>;
  type SignInRequestBody = z.infer<typeof signInSchema>;

  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
      };
    }
  }
}
