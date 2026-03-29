import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllCategories, getOneCategory, createCategory, updateCategory, removeCategory, getCoursesByCategory } from '#controllers';
import { categorySchema } from '#schemas';

const categoriesRouter = Router();

categoriesRouter
  .route('/')
  .get(authenticate, getAllCategories)
  .post(authenticate, validateZod(categorySchema), createCategory);

categoriesRouter
  .route('/:id')
  .get(authenticate, getOneCategory)
  .put(authenticate, validateZod(categorySchema), updateCategory)
  .patch(authenticate, validateZod(categorySchema.partial()), updateCategory)
  .delete(authenticate, removeCategory);

categoriesRouter.get('/:id/courses', authenticate, getCoursesByCategory);

export default categoriesRouter;
