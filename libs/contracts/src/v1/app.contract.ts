import { contract } from '../../contract';
import { apiVersionPrefix } from '../../utils';

const appContract = contract.router(
  {
    health: {
      method: 'GET',
      path: '/health',
      responses: {
        200: contract.type<{
          status: number;
          message: string;
        }>(),
      },
      summary: 'Check the health of the application.',
    },
  },
  {
    strictStatusCodes: true,
    pathPrefix: apiVersionPrefix(1) + '/app',
  },
);

export default appContract;
