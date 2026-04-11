import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllInstructors, getCoursesByInstructor, getOneInstructor, createInstructor, updateInstructor, removeInstructor } from '#controllers';
import { instructorSchema } from '#schemas';

const instructorsRouter = Router();

instructorsRouter
  .route('/')
  .get(authenticate, getAllInstructors)
  .post(authenticate, validateZod(instructorSchema), createInstructor);

instructorsRouter.get('/:id/courses', authenticate, getCoursesByInstructor);

instructorsRouter
  .route('/:id')
  .get(authenticate, getOneInstructor)
  .put(authenticate, validateZod(instructorSchema), updateInstructor)
  .patch(authenticate, validateZod(instructorSchema.partial()), updateInstructor)
  .delete(authenticate, removeInstructor);

export default instructorsRouter;
