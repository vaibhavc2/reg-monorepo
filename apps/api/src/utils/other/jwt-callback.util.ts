import { ApiError } from '@/utils';

export const jwtCallback = (err: unknown, decoded: any) => {
  if (err) {
    throw new ApiError(401, 'Invalid Access Token!');
  }
  return decoded;
};
