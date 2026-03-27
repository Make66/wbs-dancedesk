import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllInstructors, getOneInstructor, createInstructor, updateInstructor, removeInstructor } from '#controllers';
import { instructorSchema } from '#schemas';

const instructorsRouter = Router();

instructorsRouter
  .route('/')
  .get(authenticate, getAllInstructors)
  .post(authenticate, validateZod(instructorSchema), createInstructor);

instructorsRouter
  .route('/:id')
  .get(authenticate, getOneInstructor)
  .put(authenticate, validateZod(instructorSchema), updateInstructor)
  .delete(authenticate, removeInstructor);

export default instructorsRouter;
