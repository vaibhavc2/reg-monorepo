import { SelectVehicleType } from '@reg/db';
import { contract } from '../../contract';
import { ResponseType, apiVersionPrefix } from '../../utils';

const personsContract = contract.router(
  {
    'add-person': {
      method: 'POST',
      path: '/',
      responses: {
        400: ResponseType,
        403: ResponseType,
        201: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        fullName: string;
        phone: string;
        age?: number;
        address?: string;
        city?: string;
        state?: string;
        vehicleType?: number; // id of the vehicle type
        vehicleNumber?: string;
      }>(),
      summary: 'Add a new person.',
    },
    'get-vehicle-types': {
      method: 'GET',
      path: '/vehicle-types',
      responses: {
        200: contract.type<{
          status: number;
          data: SelectVehicleType[];
          message: string;
        }>(),
        403: ResponseType,
      },
      summary: 'Get all vehicle types.',
    },
  },
  {
    strictStatusCodes: true,
    pathPrefix: apiVersionPrefix(1) + '/persons',
    baseHeaders: contract.type<{
      Authorization?: string;
      'User-Agent'?: string;
    }>(),
  },
);

export default personsContract;
