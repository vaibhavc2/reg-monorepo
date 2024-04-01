import { database } from '@/db';
import { UserService, apiResponse, jwt } from '@/services';
import { cookieHeaders } from '@/utils';
import { contracts } from '@reg/contracts';
import { emailCredentials, userSessions, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type RegisterWithEmail = (typeof contracts.v1.UserContract)['auth-with-email'];
type RegisterWithEmailHandler = AppRouteImplementation<RegisterWithEmail>;

export const emailRegistrationHandler: RegisterWithEmailHandler = async ({
  body: { fullName, email, password },
  headers: { 'User-Agent': userAgent },
}) => {
  // check if the user is already registered
  const existingUser = await database.db
    ?.select()
    .from(emailCredentials)
    .where(eq(emailCredentials.email, email));

  if (existingUser && existingUser.length > 0) {
    return apiResponse.error(400, 'User already exists!');
  }

  // insert the user
  const userService = new UserService({ fullName, email, password });
  const insertedUser = await userService.insertUser();

  // verify the upserted user
  if (!insertedUser) {
    return apiResponse.serverError();
  }

  const { userId } = insertedUser;

  // create tokens
  const tokens = await jwt.generateAuthTokens(userId, email);

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: userId,
    token: tokens?.refreshToken as string,
    authType: 'email',
    userAgent: userAgent ? (userAgent as string) : null,
  });

  // get the user to send as data in the response
  let user = await database.db
    ?.select()
    .from(users)
    .where(eq(users.id, userId));

  // check if the user is present
  if (!user || user.length === 0) {
    return apiResponse.serverError();
  }

  // return success
  return apiResponse.res(
    201,
    'User registered successfully!',
    cookieHeaders(tokens),
    {
      user: {
        ...user[0],
        email,
      },
    },
  );
};
