import type { RequestHandler } from 'express';
import formidable from 'formidable';
import type { Part, Fields, Files } from 'formidable';

// 10MB
const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image'))
    throw new Error('Only images are allowed', { cause: { status: 400 } });
  return true;
};

const formidableMiddleware: RequestHandler = (req, res, next) => {
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    return next(); // body already parsed by express.json()
  }

  const form = formidable({ filter, maxFileSize });

  form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
    if (err) return next(err);

    req.body = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value?.length === 1 ? value[0] : value])
    );

    if (files?.image) {
      req.imageUrl = files.image[0];
    }

    next();
  });
};

export default formidableMiddleware;
