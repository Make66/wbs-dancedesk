import { Router } from 'express';
import { login, logout, me, refresh, register } from '#controllers';
import { authenticate, validateBodyZod } from '#middlewares';
import { loginSchema, registerSchema } from '#schemas'; // TODO: use the schemas for validation

const authRouter = Router();

authRouter.post('/register', validateBodyZod(registerSchema), register);

authRouter.post('/login', validateBodyZod(loginSchema), login);

authRouter.post('/refresh', refresh);

authRouter.delete('/logout', logout);

authRouter.get('/me', authenticate, me);

export default authRouter;
