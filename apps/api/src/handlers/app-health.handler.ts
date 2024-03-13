import { ApiError } from '@/utils';
import { appHealthMessages } from '@reg/messages';

export const appHealthHandler = async () => {
  if (appHealthMessages.success) throw new ApiError(501, 'Not implemented');
  return {
    status: 200 as 200,
    body: {
      status: 200,
      message: appHealthMessages.success,
    },
  };
};
