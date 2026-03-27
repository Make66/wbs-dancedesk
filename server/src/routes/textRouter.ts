import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllTexts, getOneText, createText, updateText, removeText } from '#controllers';
import { textSchema } from '#schemas';

const textsRouter = Router();

textsRouter
  .route('/')
  .get(authenticate, getAllTexts)
  .post(authenticate, validateZod(textSchema), createText);

textsRouter
  .route('/:id')
  .get(authenticate, getOneText)
  .put(authenticate, validateZod(textSchema), updateText)
  .delete(authenticate, removeText);

export default textsRouter;
