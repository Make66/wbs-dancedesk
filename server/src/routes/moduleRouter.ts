import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllModules, getOneModule, createModule, updateModule, removeModule } from '#controllers';
import { moduleSchema } from '#schemas';

const modulesRouter = Router();

modulesRouter
  .route('/')
  .get(authenticate, getAllModules)
  .post(authenticate, validateZod(moduleSchema), createModule);

modulesRouter
  .route('/:id')
  .get(authenticate, getOneModule)
  .put(authenticate, validateZod(moduleSchema), updateModule)
  .patch(authenticate, validateZod(moduleSchema.partial()), updateModule)
  .delete(authenticate, removeModule);

export default modulesRouter;
