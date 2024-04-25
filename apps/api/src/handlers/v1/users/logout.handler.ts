import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { userSessions } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { and, eq, inArray } from 'drizzle-orm';

type Logout = (typeof contracts.v1.users)['logout'];
type LogoutHandler = AppRouteImplementation<Logout>;

export const logoutHandler: LogoutHandler = async ({
  res,
  req: { user, token },
  query: { all },
  body: { sessionIds },
}) => {
  // check if the user is present
  if (!user || !token) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // check if all sessions are to be deleted
  if (all === 'true') {
    // delete all sessions of the user
    await database.db
      ?.delete(userSessions)
      .where(and(eq(userSessions.user, user.id)));

    // delete cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // return success
    return apiResponse.res(200, 'Logged out successfully from all devices!');
  } else if (sessionIds) {
    // delete specific sessions
    await database.db
      ?.delete(userSessions)
      .where(
        and(
          eq(userSessions.user, user.id),
          inArray(userSessions.id, sessionIds),
        ),
      );

    // delete cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // return success
    return apiResponse.res(200, 'Logged out specified devices successfully!');
  } else {
    // delete session
    await database.db
      ?.delete(userSessions)
      .where(
        and(eq(userSessions.user, user.id), eq(userSessions.token, token)),
      );

    // delete cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // return success
    return apiResponse.res(200, 'Logged out successfully!');
  }
};
