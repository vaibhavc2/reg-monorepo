import { printErrorMessage } from '@/utils';
import * as argon2 from 'argon2';

class passwordService {
  // private readonly secret: Buffer;

  constructor() {
    // this.secret = Buffer.from(env.SECRET_KEY);
  }

  public hash = async (password: string) => {
    return argon2
      .hash(password)
      .then((hash) => {
        return hash;
      })
      .catch((error) => {
        printErrorMessage(error, 'passwordService: hash()');
      });
  };

  public verify = async (hash: string, password: string) => {
    return argon2
      .verify(hash, password)
      .then((verified) => {
        return verified;
      })
      .catch((error) => {
        printErrorMessage(error, 'passwordService: verify()');
      });
  };
}

export const pwd = new passwordService();
