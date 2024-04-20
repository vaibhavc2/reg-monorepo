import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { AppRouteImplementation } from '@ts-rest/express';

type GetUserDetails = (typeof contracts.v1.UsersContract)['get-user-details'];
type GetUserDetailsHandler = AppRouteImplementation<GetUserDetails>;

export const getUserDetailsHandler: GetUserDetailsHandler = async ({
  req: { user },
}) => {
  // check if the user is present
  if (!user) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // return success
  return apiResponse.res(200, 'Fetched user details successfully!', {
    user: {
      ...user,
    },
  });
};
