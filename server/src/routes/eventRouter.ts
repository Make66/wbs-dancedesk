import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllEvents, getOneEvent, createEvent, updateEvent, removeEvent } from '#controllers';
import { eventSchema } from '#schemas';

const eventsRouter = Router();

eventsRouter
  .route('/')
  .get(authenticate, getAllEvents)
  .post(authenticate, validateZod(eventSchema), createEvent);

eventsRouter
  .route('/:id')
  .get(authenticate, getOneEvent)
  .put(authenticate, validateZod(eventSchema), updateEvent)
  .patch(authenticate, validateZod(eventSchema.partial()), updateEvent)
  .delete(authenticate, removeEvent);

export default eventsRouter;
