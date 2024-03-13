import { ApiError, lg } from '@/utils';
import { NextFunction, Request, Response } from 'express';

export class ErrorMiddleware {
  constructor() {}

  public handler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong!',
      });
    }
  };

  public logger = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (error instanceof Error || error instanceof ApiError) {
      lg.error(
        `⚠️   Error occurred on the route: ${req.path}.\n ${error.stack}`,
      );
    } else {
      lg.error(
        `💀   Something went wrong!! Terribly !!\n ⚠️   Error occurred on the route: ${req.path}.\n ${error}`,
      );
    }

    next(error);
  };

  public routeNotFound = (req: Request, res: Response, next: NextFunction) => {
    lg.error(`⚠️   Route not found: ${req.path}`);
    return res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
  };
}
