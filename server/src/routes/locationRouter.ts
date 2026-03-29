import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllLocations, getOneLocation, createLocation, updateLocation, removeLocation, getTargetsByLocation } from '#controllers';
import { locationSchema } from '#schemas';

const locationsRouter = Router();

locationsRouter
  .route('/')
  .get(authenticate, getAllLocations)
  .post(authenticate, validateZod(locationSchema), createLocation);

locationsRouter
  .route('/:id')
  .get(authenticate, getOneLocation)
  .put(authenticate, validateZod(locationSchema), updateLocation)
  .patch(authenticate, validateZod(locationSchema.partial()), updateLocation)
  .delete(authenticate, removeLocation);

locationsRouter.get('/:id/targets', authenticate, getTargetsByLocation);

export default locationsRouter;
