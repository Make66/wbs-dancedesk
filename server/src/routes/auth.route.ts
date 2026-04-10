import { Router } from 'express';
import { login, logout, me, participantLogin, participantMe, refresh, register } from '#controllers';
import { authenticate, validateBodyZod } from '#middlewares';
import { loginSchema, participantLoginSchema, registerSchema } from '#schemas';

const authRouter = Router();

authRouter.post('/register', validateBodyZod(registerSchema), register);

authRouter.post('/login', validateBodyZod(loginSchema), login);
authRouter.post('/participant-login', validateBodyZod(participantLoginSchema), participantLogin);

authRouter.post('/refresh', refresh);

authRouter.delete('/logout', logout);

authRouter.get('/me', authenticate, me);
authRouter.get('/participant-me', authenticate, participantMe);

export default authRouter;
