import { Router } from 'express';
import { authenticate, validateZod, formidableMiddleware, cloudUploader } from '#middlewares';
import { getAllParticipants, getOneParticipant, createParticipant, updateParticipant, removeParticipant, getParticipantCourses } from '#controllers';
import { participantSchema } from '#schemas';

const participantsRouter = Router();

participantsRouter
  .route('/')
  .get(authenticate, getAllParticipants)
  .post(authenticate, formidableMiddleware, cloudUploader, validateZod(participantSchema), createParticipant);

participantsRouter
  .route('/:id')
  .get(authenticate, getOneParticipant)
  .put(authenticate, formidableMiddleware, cloudUploader, validateZod(participantSchema), updateParticipant)
  .patch(authenticate, formidableMiddleware, cloudUploader, validateZod(participantSchema.partial()), updateParticipant)
  .delete(authenticate, removeParticipant);

participantsRouter
  .route('/:id/courses')
  .get(authenticate, getParticipantCourses);

export default participantsRouter;
