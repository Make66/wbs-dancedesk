import { Router } from 'express';
import { authenticate } from '#middlewares';
import { getParticipantCourses } from '#controllers';

const participantsRouter = Router();

participantsRouter
  .route('/:id/courses')
  .get(authenticate, getParticipantCourses);

export default participantsRouter;
