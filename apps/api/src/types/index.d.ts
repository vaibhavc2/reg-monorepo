import { IUser, IUserCredential, IUsername } from '@/db/schema';

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
