import { database } from '@/db';
import { apiResponse, jwt } from '@/services';
import { asyncHandler } from '@/utils';
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

      if (!token) {
        return res
          .status(401)
          .json(apiResponse.error(401, 'Unauthorized!').body);
      }

      // if yes, verify token
      const { id } = jwt.verifyAccessToken(token) ?? {};

      // find user in db using the decoded token
      const user = await database.db
        ?.select()
        .from(users)
        .where(eq(users.id, id as number));

      if (!user || !user[0] || user.length !== 1) {
        return res
          .status(401)
          .json(
            apiResponse.error(401, 'Invalid Access Token! Unauthorized!').body,
          );
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
        return res.status(403).json(apiResponse.error(403, 'Forbidden!').body);
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
        return res.status(403).json(apiResponse.error(403, 'Forbidden!').body);
      }

      next();
    },
  );
}
