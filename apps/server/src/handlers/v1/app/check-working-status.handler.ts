import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { AppRouteImplementation } from '@ts-rest/express';

type CheckHealth = (typeof contracts.v1.app)['health'];
type CheckHealthHandler = AppRouteImplementation<CheckHealth>;

export const checkHealthHandler: CheckHealthHandler = async () => {
  const currentTime = new Date().toLocaleTimeString();

  return apiResponse.res(
    200,
    `The server is running 'OK'. Current time is ${currentTime}`,
  );
};
