import { IUser, IUserCredential, IUsername } from '@reg/db/types';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      username?: IUsername;
      credentials?: IUserCredential;
    }
  }

  namespace GlobalTypes {
    type MulterFiles = { [fieldname: string]: Express.Multer.File[] };
  }
}

export {};
