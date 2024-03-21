import { db } from '@/db';
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
      const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      // if not, throw error
      if (!token) {
        throw new ApiError(401, 'Unauthorized!');
      }

      // if yes, verify token
      const decodedToken: any = jwt.verifyAccessToken(token);

      // find user in db using the decoded token
      const user = await db
        ?.select()
        .from(users)
        .where(eq(users.id, decodedToken.id));

      // if user not found, throw error
      if (!user || !user[0] || user.length !== 1) {
        throw new ApiError(401, 'Invalid Access Token!');
      }

      // if user found, attach userId and userRole to req object
      req.userId = user[0].id;
      req.userRole = user[0].role;

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
      // check if user is moderator or admin

      next();
    },
  );
}
