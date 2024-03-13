import { appHealthMessages } from '@reg/messages';

export const appHealthHandler = async () => {
  const currentTime = new Date().toLocaleTimeString();

  return {
    status: 200 as 200,
    body: {
      status: 200,
      message: `${appHealthMessages.success}. Current time is ${currentTime}`,
    },
  };
};
