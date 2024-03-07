import ct from '@/constants';
import { cloudinaryService } from '@/services';
import { ApiError, asyncHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FilesMiddleware {
  constructor() {}

  public uploadLocally = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'temp/uploads');
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
      },
    }),
  });

  public uploadImage = ({ thumbnail = false }) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      // get image local path
      const imageLocalPath = req.file?.path;

      // check if image file is missing
      if (!imageLocalPath) {
        throw new ApiError(
          400,
          `${thumbnail ? 'Thumbnail' : 'Image'} file upload failed!`,
        );
      }

      // check if image is a valid image file
      if (!ct.mimeTypes.image.includes(req.file?.mimetype as string)) {
        throw new ApiError(
          400,
          `Invalid ${thumbnail ? 'Thumbnail' : 'Image'} file!`,
        );
      }

      // upload image to cloudinary
      const image =
        await cloudinaryService.uploadFileToCloudinary(imageLocalPath);

      // check if image upload failed
      if (!image?.secure_url) {
        throw new ApiError(
          400,
          `${thumbnail ? 'Thumbnail' : 'Image'} file upload failed!`,
        );
      }

      // save image url to request body
      req.body.imageUrl = image.secure_url;

      // next middleware
      next();
    });
}
