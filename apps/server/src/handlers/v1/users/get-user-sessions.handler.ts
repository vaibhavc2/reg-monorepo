import { database } from '@/db';
import { apiResponse } from '@/services';
import { checkUser } from '@/utils';
import { contracts } from '@reg/contracts';
import { userSessions } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GetUserSessions = (typeof contracts.v1.users)['get-user-sessions'];
type GetUserSessionsHandler = AppRouteImplementation<GetUserSessions>;

export const getUserSessionsHandler: GetUserSessionsHandler = async ({
  headers: { 'user-agent': userAgent },
  req: { user, token },
  // query: { current, page, limit }
}) => {
  if (!user || !token) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // check if user status is valid
  if (!checkUser(user)) {
    return apiResponse.error(403, 'Forbidden!');
  }

  // get the user sessions
  const sessions = (
    await database.db
      ?.select()
      .from(userSessions)
      .where(eq(userSessions.user, user.id))
  )?.map((session) => {
    if (session.userAgent === userAgent && session.token === token) {
      return { ...session, current: true }; // mark the current session
    } else {
      return session;
    }
  });

  return apiResponse.res(200, 'Fetched user sessions successfully!', {
    sessions,
  });
};
