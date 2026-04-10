import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllParticipants, getOneParticipant, createParticipant, updateParticipant, removeParticipant, getParticipantCourses } from '#controllers';
import { participantSchema } from '#schemas';

const participantsRouter = Router();

participantsRouter
  .route('/')
  .get(authenticate, getAllParticipants)
  .post(authenticate, validateZod(participantSchema), createParticipant);

participantsRouter
  .route('/:id')
  .get(authenticate, getOneParticipant)
  .put(authenticate, validateZod(participantSchema), updateParticipant)
  .patch(authenticate, validateZod(participantSchema.partial()), updateParticipant)
  .delete(authenticate, removeParticipant);

participantsRouter
  .route('/:id/courses')
  .get(authenticate, getParticipantCourses);

export default participantsRouter;
