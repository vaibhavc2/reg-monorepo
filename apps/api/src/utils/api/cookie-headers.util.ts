import ct from '@/constants';
import { getCookieString } from '..';

export const cookieHeaders = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => ({
  'Set-Cookie': [
    getCookieString(
      'accessToken',
      tokens?.accessToken as string,
      ct.cookieOptions.auth,
    ),
    getCookieString(
      'refreshToken',
      tokens?.refreshToken as string,
      ct.cookieOptions.auth,
    ),
  ],
});
