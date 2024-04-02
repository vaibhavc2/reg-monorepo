import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { userSessions } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { and, eq } from 'drizzle-orm';

type Logout = (typeof contracts.v1.UserContract)['logout'];
type LogoutHandler = AppRouteImplementation<Logout>;

export const logoutHandler: LogoutHandler = async ({
  req: {
    user,
    cookies: { refreshToken },
  },
  res,
}) => {
  // check if the user is present
  if (!user) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // check if the refresh token is present
  if (!refreshToken) {
    return apiResponse.error(400, 'Invalid session!');
  }

  // delete session
  const sessionTable = await database.db
    ?.delete(userSessions)
    .where(
      and(
        eq(userSessions.user, user.id as number),
        eq(userSessions.token, refreshToken as string),
      ),
    )
    .execute();

  // check if session was deleted
  if (!sessionTable || sessionTable[0].affectedRows !== 1) {
    return apiResponse.error(400, 'Invalid session!');
  }

  // delete cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  // return success
  return apiResponse.res(200, 'Logged out successfully!');
};
