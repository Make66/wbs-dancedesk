import { Router } from 'express';
import { authenticatePublic } from '#middlewares';
import { bootstrapHandler, coursesHandler } from '#controllers';

const publicRouter = Router();

publicRouter.get('/bootstrap', authenticatePublic, bootstrapHandler);
publicRouter.get('/courses', authenticatePublic, coursesHandler);

export default publicRouter;
