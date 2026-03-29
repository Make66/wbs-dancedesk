import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllRegistrations, getOneRegistration, createRegistration, updateRegistration, removeRegistration } from '#controllers';
import { registrationSchema } from '#schemas';

const registrationsRouter = Router();

registrationsRouter
  .route('/')
  .get(authenticate, getAllRegistrations)
  .post(authenticate, validateZod(registrationSchema), createRegistration);

registrationsRouter
  .route('/:id')
  .get(authenticate, getOneRegistration)
  .put(authenticate, validateZod(registrationSchema), updateRegistration)
  .patch(authenticate, validateZod(registrationSchema.partial()), updateRegistration)
  .delete(authenticate, removeRegistration);

export default registrationsRouter;
