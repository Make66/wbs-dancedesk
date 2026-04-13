import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { openSession, sendMessage, getSession } from '#controllers';
import { chatSessionSchema, chatMessageSchema } from '#schemas';

const chatRouter = Router();

chatRouter.post('/',           authenticate, validateZod(chatSessionSchema),  openSession);
chatRouter.post('/messages',   authenticate, validateZod(chatMessageSchema),  sendMessage);
chatRouter.get('/:sessionId',  authenticate, getSession);

export default chatRouter;
