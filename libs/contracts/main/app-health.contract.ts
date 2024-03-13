import { contract } from '../contract';

const AppHealthContract = contract.router(
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
  },
);

export default AppHealthContract;
