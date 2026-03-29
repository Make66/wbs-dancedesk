import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllTargets, getOneTarget, createTarget, updateTarget, removeTarget, getCategoriesByTarget, getTargetWithCourses } from '#controllers';
import { targetSchema } from '#schemas';

const targetInputSchema = targetSchema.omit({ categories: true });

const targetsRouter = Router();

targetsRouter
  .route('/')
  .get(authenticate, getAllTargets)
  .post(authenticate, validateZod(targetInputSchema), createTarget);

targetsRouter
  .route('/:id')
  .get(authenticate, getOneTarget)
  .put(authenticate, validateZod(targetInputSchema), updateTarget)
  .patch(authenticate, validateZod(targetInputSchema.partial()), updateTarget)
  .delete(authenticate, removeTarget);

targetsRouter.get('/:id/categories', authenticate, getCategoriesByTarget);
targetsRouter.get('/:id/courses', authenticate, getTargetWithCourses);

export default targetsRouter;
