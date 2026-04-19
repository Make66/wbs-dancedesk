import { Router } from 'express';
import { authenticate } from '#middlewares';
import { refreshNews } from '#controllers';

const newsRouter = Router();

newsRouter.post('/refresh', authenticate, refreshNews);

export default newsRouter;
