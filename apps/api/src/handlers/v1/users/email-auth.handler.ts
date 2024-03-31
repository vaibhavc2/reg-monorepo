import ct from '@/constants';
import { database } from '@/db';
import { UserService, jwt } from '@/services';
import { ApiError, getCookieString } from '@/utils';
import { contracts } from '@reg/contracts';
import { userSessions, users, verifications } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type RegisterWithEmail = (typeof contracts.v1.UserContract)['auth-with-email'];
type RegisterWithEmailHandler = AppRouteImplementation<RegisterWithEmail>;

export const emailAuthHandler: RegisterWithEmailHandler = async ({
  body: { fullName, email, password },
  headers: { 'User-Agent': userAgent },
}) => {
  // try {
  // validation using middleware
  // upsert user using userservice
  const userService = new UserService({ fullName, email, password });

  // upsert the user
  const upsertedUser = await userService.upsertUser();

  // verify the upserted user
  if (!upsertedUser) {
    throw new ApiError(500);
  }

  const { userId } = upsertedUser;

  // create tokens
  const tokens = await jwt.generateAuthTokens(userId, email);

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: userId,
    token: tokens?.refreshToken as string,
    authType: 'email',
    userAgent: userAgent ? (userAgent as string) : null,
  });

  // save verification record of the user
  await database.db?.insert(verifications).values({
    user: userId,
  });

  // get the user to send as data in the response
  let user = await database.db
    ?.select()
    .from(users)
    .where(eq(users.id, userId));

  // check if the user is present
  if (!user || user.length === 0) {
    throw new ApiError(500);
  }

  // return success
  return {
    status: 201 as 201,
    headers: {
      'Set-Cookie': [
        getCookieString(
          'accessToken',
          tokens?.accessToken as string,
          ct.cookieOptions.auth,
        ),
        getCookieString(
          'refreshToken',
          tokens?.refreshToken as string,
          ct.cookieOptions.auth,
        ),
      ],
    },
    body: {
      status: 201,
      data: {
        user: {
          ...user[0],
          email,
        },
      },
      message: 'User registered successfully!',
    },
  };
  // } catch (error) {
  //   throw new ApiError(500, 'Something went wrong!', error);
  // }
};
