import { ApiError } from '@/utils';

export const jwtCallback = (err: unknown, payload: any) => {
  if (err) {
    throw new ApiError(401, 'Invalid Access Token! Unauthorized!');
  }
  return payload;
};
