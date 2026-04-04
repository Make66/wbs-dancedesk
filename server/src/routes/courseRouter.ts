import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllCourses, getOneCourse, createCourse, updateCourse, removeCourse, getCourseDates, getWeekCourses } from '#controllers';
import { courseSchema } from '#schemas';

const coursesRouter = Router();

coursesRouter
  .route('/')
  .get(authenticate, getAllCourses)
  .post(authenticate, validateZod(courseSchema), createCourse);

coursesRouter
  .route('/week')
  .get(authenticate, getWeekCourses);

coursesRouter
  .route('/week/:number')
  .get(authenticate, getWeekCourses);

coursesRouter
  .route('/:id/dates')
  .get(authenticate, getCourseDates);

coursesRouter
  .route('/:id')
  .get(authenticate, getOneCourse)
  .put(authenticate, validateZod(courseSchema), updateCourse)
  .patch(authenticate, validateZod(courseSchema.partial()), updateCourse)
  .delete(authenticate, removeCourse);

export default coursesRouter;
