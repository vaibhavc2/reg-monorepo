import { contracts } from '@reg/contracts';
import { appHealthMessages } from '@reg/messages';
import { AppRouteImplementation } from '@ts-rest/express';

type CheckHealth = (typeof contracts.v1.AppContract)['health'];
type CheckHealthHandler = AppRouteImplementation<CheckHealth>;

export const checkHealthHandler: CheckHealthHandler = async () => {
  const currentTime = new Date().toLocaleTimeString();

  return {
    status: 200 as 200,
    body: {
      status: 200,
      message: `${appHealthMessages.success}. Current time is ${currentTime}`,
    },
  };
};
