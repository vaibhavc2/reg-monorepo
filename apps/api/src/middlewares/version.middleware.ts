import env from '@/config';
import { NextFunction, Request, Response } from 'express';
import semver from 'semver';

export class Versioning {
  constructor() {}

  public checkApiVersion =
    (version: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      if (semver.gte(String(req.headers['API-VERSION']), version)) {
        return next();
      }

      return next('route'); // skip to the next route
    };

  public supplyAppVersion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    res.set('APP-VERSION', env.APP_VERSION);

    next();
  };
}
