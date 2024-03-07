import { asyncHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';

export class Authentication {
  constructor() {}

  public user = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // check if token exists
      // if not, throw error
      // if yes, verify token
      // find user in db using the decoded token
      // if user not found, throw error
      // if user found, attach user to req object

      next();
    },
  );

  public admin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // check if user is admin

      next();
    },
  );

  public moderator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // check if user is moderator

      next();
    },
  );
}
