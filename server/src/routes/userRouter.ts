import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllUsers, getOneUser, createUser, updateUser, removeUser } from '#controllers';
import { userSchema } from '#schemas';

const userInputSchema = userSchema.omit({ tenantId: true, refreshToken: true });

const usersRouter = Router();

usersRouter
  .route('/')
  .get(authenticate, getAllUsers)
  .post(authenticate, validateZod(userInputSchema), createUser);

usersRouter
  .route('/:id')
  .get(authenticate, getOneUser)
  .put(authenticate, validateZod(userInputSchema), updateUser)
  .patch(authenticate, validateZod(userInputSchema.partial()), updateUser)
  .delete(authenticate, removeUser);

export default usersRouter;
