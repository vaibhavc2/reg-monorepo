import { database } from '@/db';
import { jwt } from '@/services';
import { ApiError, asyncHandler } from '@/utils';
import { users } from '@reg/db';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

export class Authentication {
  constructor() {}

  public user = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // this checks if user is authenticated
      // check if token exists
      const token: string | undefined =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      // if not, throw error
      if (!token) {
        throw new ApiError(401, 'Unauthorized!');
      }

      // if yes, verify token
      const decodedToken = jwt.verifyAccessToken(token);

      // find user in db using the decoded token
      const user = await database.db
        ?.select()
        .from(users)
        .where(eq(users.id, decodedToken.id));

      // if user not found, throw error
      if (!user || !user[0] || user.length !== 1) {
        throw new ApiError(401, 'Invalid Access Token!');
      }

      // if user found, attach user to req object
      req.user = user[0];

      next();
    },
  );

  public admin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // authenticate user
      await this.user(req, res, next);

      // check if user is admin
      if (req.user?.role !== 'admin') {
        throw new ApiError(403, 'Forbidden!');
      }

      next();
    },
  );

  public moderator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // authenticate user
      await this.user(req, res, next);

      // check if user is moderator or admin
      if (req.user?.role !== 'moderator' && req.user?.role !== 'admin') {
        throw new ApiError(403, 'Forbidden!');
      }

      next();
    },
  );
}
