import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GetUserDetails = (typeof contracts.v1.UserContract)['get-user-details'];
type GetUserDetailsHandler = AppRouteImplementation<GetUserDetails>;

export const getUserDetailsHandler: GetUserDetailsHandler = async ({
  req: { user },
}) => {
  // check if the user is present
  if (!user || !user.id) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // get the user creds
  const creds = await database.db
    ?.select({
      email: emailCredentials.email,
    })
    .from(emailCredentials)
    .where(eq(emailCredentials.user, user.id as number));

  // return success
  return apiResponse.res(200, 'Fetched user details successfully!', {
    user: {
      ...user,
      email: creds?.[0]?.email || null,
    },
  });
};
