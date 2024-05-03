import { queries } from '@/queries';
import { apiResponse } from '@/services';
import { checkUser } from '@/utils';
import { contracts } from '@reg/contracts';
import { AppRouteImplementation } from '@ts-rest/express';

type GetVehicleTypes = (typeof contracts.v1.persons)['get-vehicle-types'];
type GetVehicleTypesHandler = AppRouteImplementation<GetVehicleTypes>;

export const getVehicleTypesHandler: GetVehicleTypesHandler = async ({
  req: { user },
}) => {
  // check if user is admin and moderator
  if (!user || checkUser(user)) {
    return apiResponse.error(403, 'Forbidden');
  }

  // get all vehicle types
  const vehicleTypes = await queries.persons.getVehicleTypes();

  // return the response
  return apiResponse.res(200, 'Vehicle Types fetched successfully!', {
    vehicleTypes,
  });
};
