import { Router } from 'express';
import { authenticate, cloudUploader, formidableMiddleware, validateZod } from '#middlewares';
import { getAllPosts, getOnePost, createPost, updatePost, removePost } from '#controllers';
import { postSchema } from '#schemas';

const postsRouter = Router();

postsRouter
  .route('/')
  .get(authenticate, getAllPosts)
  .post(authenticate, formidableMiddleware, cloudUploader, validateZod(postSchema), createPost);

postsRouter
  .route('/:id')
  .get(authenticate, getOnePost)
  .put(authenticate, formidableMiddleware, cloudUploader, validateZod(postSchema), updatePost)
  .patch(authenticate, formidableMiddleware, cloudUploader, validateZod(postSchema.partial()), updatePost)
  .delete(authenticate, removePost);

export default postsRouter;
