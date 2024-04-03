import { ApiError } from '@/utils';

export const jwtCallback = (err: unknown, payload: any) => {
  if (err) {
    throw new ApiError(401, 'Invalid Token! Unauthorized!');
  }
  return payload;
};
