import { Router } from 'express';
import { authenticate, validateZod, formidableMiddleware, cloudUploader } from '#middlewares';
import { getAllEvents, getMonthEvents, getUpcomingEvents, getOneEvent, createEvent, updateEvent, removeEvent } from '#controllers';
import { eventSchema } from '#schemas';

const eventsRouter = Router();

eventsRouter.get('/upcoming', authenticate, getUpcomingEvents);
eventsRouter.get('/month', authenticate, getMonthEvents);
eventsRouter.get('/month/:number', authenticate, getMonthEvents);

eventsRouter
  .route('/')
  .get(authenticate, getAllEvents)
  .post(authenticate, formidableMiddleware, cloudUploader, validateZod(eventSchema), createEvent);

eventsRouter
  .route('/:id')
  .get(authenticate, getOneEvent)
  .put(authenticate, formidableMiddleware, cloudUploader, validateZod(eventSchema), updateEvent)
  .patch(authenticate, formidableMiddleware, cloudUploader, validateZod(eventSchema.partial()), updateEvent)
  .delete(authenticate, removeEvent);

export default eventsRouter;
