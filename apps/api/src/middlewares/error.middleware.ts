import {
  ApiError,
  ApiResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  lg,
} from '@/utils';
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
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, error.message));
    } else {
      return res.status(500).json(new InternalServerErrorResponse());
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
    return res.status(404).json(new NotFoundResponse('Route not found.'));
  };
}
