import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAll, getOne, create, update, remove } from '#controllers';
import { targetSchema } from '#schemas';

const targetInputSchema = targetSchema.omit({ categories: true });

const targetsRouter = Router();

targetsRouter
  .route('/')
  .get(authenticate, getAll)
  .post(authenticate, validateZod(targetInputSchema), create);

targetsRouter
  .route('/:id')
  .get(authenticate, getOne)
  .put(authenticate, validateZod(targetInputSchema), update)
  .delete(authenticate, remove);

export default targetsRouter;
