import env from '@/config';
import { NextFunction, Request, Response } from 'express';

export class Versioning {
  constructor() {}

  public supplyAppVersion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // set the App-Version header
    res.set('App-Version', env.APP_VERSION);

    next();
  };
}
