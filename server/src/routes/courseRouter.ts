import { Router } from "express";
import { authenticate, validateZod } from "#middlewares";
import {
  getAllCourses,
  getOneCourse,
  createCourse,
  updateCourse,
  removeCourse,
  getCourseDates,
  getWeekCourses,
  getMonthCourses,
  getCourseParticipants,
} from "#controllers";
import { courseSchema, courseUpdateSchema } from "#schemas";

const coursesRouter = Router();

coursesRouter
  .route("/")
  .get(authenticate, getAllCourses)
  .post(authenticate, validateZod(courseSchema), createCourse);

coursesRouter.route("/week").get(authenticate, getWeekCourses);
coursesRouter.route("/week/:number").get(authenticate, getWeekCourses);

coursesRouter.route("/month").get(authenticate, getMonthCourses);
coursesRouter.route("/month/:number").get(authenticate, getMonthCourses);

coursesRouter.route("/:id/participants").get(authenticate, getCourseParticipants);

coursesRouter.route("/:id/dates").get(authenticate, getCourseDates);

coursesRouter
  .route("/:id")
  .get(authenticate, getOneCourse)
  .put(authenticate, validateZod(courseSchema), updateCourse)
  .patch(authenticate, validateZod(courseUpdateSchema), updateCourse)
  .delete(authenticate, removeCourse);

export default coursesRouter;
