import { insertSchema } from '@reg/db';
import { z } from 'zod';
// import { TsRestRequest as OriginalTsRestRequest } from '@ts-rest/express';

type User = z.infer<typeof insertSchema.users>;

declare global {
  namespace Express {
    // type MulterFile = Express.Multer.File;
    // type MulterFiles = { [fieldname: string]: Express.Multer.File[] };
    interface Request {
      user?: User;
      // file?: MulterFile;
      // files?: MulterFiles;
    }
  }
}

// declare module '@ts-rest/express' {
//   export interface TsRestRequest extends OriginalTsRestRequest {
//     user?: User;
//   }
// }

export {};
