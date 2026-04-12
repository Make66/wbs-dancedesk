import { Router } from 'express';
import { authenticate, validateZod, formidableMiddleware, cloudUploader } from '#middlewares';
import { getAllLocations, getOneLocation, createLocation, updateLocation, removeLocation, getTargetsByLocation, getRoomsByLocation, getEventsByLocation } from '#controllers';
import { locationSchema } from '#schemas';

const locationsRouter = Router();

locationsRouter
  .route('/')
  .get(authenticate, getAllLocations)
  .post(authenticate, formidableMiddleware, cloudUploader, validateZod(locationSchema), createLocation);

locationsRouter
  .route('/:id')
  .get(authenticate, getOneLocation)
  .put(authenticate, formidableMiddleware, cloudUploader, validateZod(locationSchema), updateLocation)
  .patch(authenticate, formidableMiddleware, cloudUploader, validateZod(locationSchema.partial()), updateLocation)
  .delete(authenticate, removeLocation);

locationsRouter.get('/:id/targets', authenticate, getTargetsByLocation);
locationsRouter.get('/:id/rooms', authenticate, getRoomsByLocation);
locationsRouter.get('/:id/events', authenticate, getEventsByLocation);

export default locationsRouter;
