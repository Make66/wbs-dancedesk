import { Router } from 'express';
import { authenticate, validateZod, formidableMiddleware, cloudUploader } from '#middlewares';
import { getAllRooms, getOneRoom, createRoom, updateRoom, removeRoom, getEventsByRoom } from '#controllers';
import { roomSchema } from '#schemas';

const roomsRouter = Router();

roomsRouter
  .route('/')
  .get(authenticate, getAllRooms)
  .post(authenticate, formidableMiddleware, cloudUploader, validateZod(roomSchema), createRoom);

roomsRouter
  .route('/:id')
  .get(authenticate, getOneRoom)
  .put(authenticate, formidableMiddleware, cloudUploader, validateZod(roomSchema), updateRoom)
  .patch(authenticate, formidableMiddleware, cloudUploader, validateZod(roomSchema.partial()), updateRoom)
  .delete(authenticate, removeRoom);

roomsRouter.get('/:id/events', authenticate, getEventsByRoom);

export default roomsRouter;
