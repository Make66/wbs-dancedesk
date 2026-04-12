import { v2 as cloudinary } from 'cloudinary';
import { type RequestHandler } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure_url: true
});

const cloudUploader: RequestHandler = async (req, res, next) => {
  try {
    if (req.imageUrl) {
      const filePath = req.imageUrl.filepath;
      const cloudinaryData = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
      req.body.imageUrl = cloudinaryData.secure_url;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;
