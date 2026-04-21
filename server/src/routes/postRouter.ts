import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getAllPosts, getOnePost, createPost, updatePost, removePost } from '#controllers';
import { postSchema } from '#schemas';

const postsRouter = Router();

postsRouter
  .route('/')
  .get(authenticate, getAllPosts)
  .post(authenticate, validateZod(postSchema), createPost);

postsRouter
  .route('/:id')
  .get(authenticate, getOnePost)
  .put(authenticate, validateZod(postSchema), updatePost)
  .patch(authenticate, validateZod(postSchema.partial()), updatePost)
  .delete(authenticate, removePost);

export default postsRouter;
