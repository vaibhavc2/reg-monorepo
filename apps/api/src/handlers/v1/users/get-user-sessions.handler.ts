import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { userSessions } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GetUserSessions = (typeof contracts.v1.UsersContract)['get-user-sessions'];
type GetUserSessionsHandler = AppRouteImplementation<GetUserSessions>;

export const getUserSessionsHandler: GetUserSessionsHandler = async ({
  headers,
  req: { user },
  // query: { current, page, limit }
}) => {
  if (!user || !headers.authorization) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // get the user sessions
  const sessions = (
    await database.db
      ?.select()
      .from(userSessions)
      .where(eq(userSessions.user, user.id as number))
  )?.map((session) => {
    if (
      session.userAgent === headers['user-agent'] &&
      session.token === headers.authorization
    ) {
      return { ...session, current: true }; // mark the current session
    } else {
      return session;
    }
  });

  return apiResponse.res(200, 'Fetched user sessions successfully!', {
    sessions,
  });
};
