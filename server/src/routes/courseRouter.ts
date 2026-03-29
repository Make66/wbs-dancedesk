import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllCourses, getOneCourse, createCourse, updateCourse, removeCourse } from '#controllers';
import { courseSchema } from '#schemas';

const coursesRouter = Router();

coursesRouter
  .route('/')
  .get(authenticate, getAllCourses)
  .post(authenticate, validateZod(courseSchema), createCourse);

coursesRouter
  .route('/:id')
  .get(authenticate, getOneCourse)
  .put(authenticate, validateZod(courseSchema), updateCourse)
  .patch(authenticate, validateZod(courseSchema.partial()), updateCourse)
  .delete(authenticate, removeCourse);

export default coursesRouter;
