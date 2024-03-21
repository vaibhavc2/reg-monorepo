import { insertSchema } from '@reg/db';
import { z } from 'zod';

type user = z.infer<typeof insertSchema.users>;
type userId = user['id'];
type userRole = user['role'];

declare global {
  namespace Express {
    type MulterFile = Express.Multer.File;
    type MulterFiles = { [fieldname: string]: Express.Multer.File[] };

    interface Request {
      userId?: userId;
      userRole?: userRole;
      file?: MulterFile;
      files?: MulterFiles;
    }
  }
}

// custom types

export {};
