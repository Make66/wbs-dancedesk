import { Router } from 'express';
import { authenticatePublic } from '#middlewares';
import { bootstrapHandler, coursesHandler, newsHandler } from '#controllers';

const publicRouter = Router();

publicRouter.get('/bootstrap', authenticatePublic, bootstrapHandler);
publicRouter.get('/courses', authenticatePublic, coursesHandler);
publicRouter.get('/news', authenticatePublic, newsHandler);

export default publicRouter;
