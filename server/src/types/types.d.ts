import { signInSchema, userSchema } from '#schemas';
import type { z } from 'zod/v4';

declare global {
  type UserRequestBody = z.infer<typeof userSchema>;
  type SignInRequestBody = z.infer<typeof signInSchema>;

  interface User {
    id: string;
    tenantId: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    password: string;
    imageUrl: string;
    active: boolean;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
  }

  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
        role: 'user' | 'participant';
      };
    }
  }
}
