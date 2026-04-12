import { Router } from 'express';
import { authenticate, validateZod, formidableMiddleware, cloudUploader } from '#middlewares';
import { getAllUsers, getOneUser, createUser, updateUser, removeUser } from '#controllers';
import { userSchema } from '#schemas';

const userInputSchema = userSchema.omit({ refreshToken: true });

const usersRouter = Router();

usersRouter
  .route('/')
  .get(authenticate, getAllUsers)
  .post(authenticate, formidableMiddleware, cloudUploader, validateZod(userInputSchema), createUser);

usersRouter
  .route('/:id')
  .get(authenticate, getOneUser)
  .put(authenticate, formidableMiddleware, cloudUploader, validateZod(userInputSchema), updateUser)
  .patch(authenticate, formidableMiddleware, cloudUploader, validateZod(userInputSchema.partial()), updateUser)
  .delete(authenticate, removeUser);

export default usersRouter;
