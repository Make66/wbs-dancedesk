import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllCustomers, getOneCustomer, createCustomer, updateCustomer, removeCustomer } from '#controllers';
import { customerSchema } from '#schemas';

const customersRouter = Router();

customersRouter
  .route('/')
  .get(authenticate, getAllCustomers)
  .post(authenticate, validateZod(customerSchema), createCustomer);

customersRouter
  .route('/:id')
  .get(authenticate, getOneCustomer)
  .put(authenticate, validateZod(customerSchema), updateCustomer)
  .delete(authenticate, removeCustomer);

export default customersRouter;
