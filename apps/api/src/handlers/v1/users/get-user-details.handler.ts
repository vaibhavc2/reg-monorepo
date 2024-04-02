import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, userSessions } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GetUserDetails = (typeof contracts.v1.UserContract)['get-user-details'];
type GetUserDetailsHandler = AppRouteImplementation<GetUserDetails>;

export const getUserDetailsHandler: GetUserDetailsHandler = async ({
  headers,
  req: { user },
}) => {
  // check if the user is present
  if (!user) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // get the user creds
  const creds = await database.db
    ?.select({
      email: emailCredentials.email,
    })
    .from(emailCredentials)
    .where(eq(emailCredentials.user, user.id as number));

  //?>> remove sessions in the future maybe
  // get the user sessions
  const sessions = (
    await database.db
      ?.select()
      .from(userSessions)
      .where(eq(userSessions.user, user.id as number))
  )?.map((session) => {
    if (session.userAgent === headers['user-agent']) {
      return { ...session, current: true };
    } else {
      return session;
    }
  });

  // return success
  return apiResponse.res(200, 'Fetched user details successfully!', {
    user: {
      ...user,
      email: creds?.[0]?.email || null,
    },
    sessions,
  });
};
