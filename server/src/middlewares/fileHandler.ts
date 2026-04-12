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
  const form = formidable({ filter, maxFileSize });

  form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      next(err);
    }

    req.body = fields;

    if (files?.image) {
      req.imageUrl = files.image[0];
    }

    next();
  });
};

export default formidableMiddleware;
