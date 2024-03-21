import env from '@/config';
import { NextFunction, Request, Response } from 'express';

export class Versioning {
  constructor() {}

  public supplyAppVersion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // set the APP-VERSION header
    res.set('APP-VERSION', env.APP_VERSION);

    next();
  };
}
