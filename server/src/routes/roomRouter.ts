import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllRooms, getOneRoom, createRoom, updateRoom, removeRoom } from '#controllers';
import { roomSchema } from '#schemas';

const roomsRouter = Router();

roomsRouter
  .route('/')
  .get(authenticate, getAllRooms)
  .post(authenticate, validateZod(roomSchema), createRoom);

roomsRouter
  .route('/:id')
  .get(authenticate, getOneRoom)
  .put(authenticate, validateZod(roomSchema), updateRoom)
  .delete(authenticate, removeRoom);

export default roomsRouter;
