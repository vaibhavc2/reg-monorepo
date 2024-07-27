import { apiResponse } from '@/services';
import { checkUser } from '@/utils';
import { contracts } from '@reg/contracts';
import { AppRouteImplementation } from '@ts-rest/express';

type GetUserDetails = (typeof contracts.v1.users)['get-user-details'];
type GetUserDetailsHandler = AppRouteImplementation<GetUserDetails>;

export const getUserDetailsHandler: GetUserDetailsHandler = async ({
  req: { user },
}) => {
  // check if user status is valid
  if (!user || !checkUser(user)) {
    return apiResponse.error(403, 'Forbidden!');
  }

  // return success
  return apiResponse.res(200, 'Fetched user details successfully!', {
    user: {
      ...user,
    },
  });
};
