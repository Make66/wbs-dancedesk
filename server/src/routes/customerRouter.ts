import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllCustomers, getOneCustomer, getCustomerBySignInKey, createCustomer, updateCustomer, removeCustomer } from '#controllers';
import { customerSchema } from '#schemas';

const customersRouter = Router();

customersRouter.get('/by-signinkey/:signInKey', getCustomerBySignInKey);

customersRouter
  .route('/')
  .get(authenticate, getAllCustomers)
  .post(authenticate, validateZod(customerSchema), createCustomer);

customersRouter
  .route('/:id')
  .get(authenticate, getOneCustomer)
  .put(authenticate, validateZod(customerSchema), updateCustomer)
  .patch(authenticate, validateZod(customerSchema.partial()), updateCustomer)
  .delete(authenticate, removeCustomer);

export default customersRouter;
