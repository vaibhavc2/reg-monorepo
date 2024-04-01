import ct from '@/constants';
import { cloudinary } from '@/services';
import { ApiError, asyncHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FilesMiddleware {
  constructor() {}

  private multerUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'temp/uploads');
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
      },
    }),
  }).any();

  private multerPromise = (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
      this.multerUpload(req, res, (err) => {
        if (!err) resolve(req);
        reject(err);
      });
    });
  };

  public multer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.multerPromise(req, res);
      next();
    } catch (err) {
      next(err);
    }
  };

  public uploadImageToCloudinary = (imgName?: string) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      // get image local path
      const imageLocalPath = req.file?.path;

      // check if image file is missing
      if (!imageLocalPath) {
        throw new ApiError(
          400,
          `${imgName ? imgName : 'Image'} file upload failed!`,
        );
      }

      // check if image is a valid image file
      if (!ct.mimeTypes.image.includes(req.file?.mimetype as string)) {
        throw new ApiError(400, `Invalid ${imgName ? imgName : 'Image'} file!`);
      }

      // upload image to cloudinary
      const image = await cloudinary.upload(imageLocalPath);

      // check if image upload failed
      if (!image?.secure_url) {
        throw new ApiError(
          400,
          `${imgName ? imgName : 'Image'} file upload failed!`,
        );
      }

      // save image url to request body
      req.body.imageUrl = image.secure_url;

      // next middleware
      next();
    });
}
