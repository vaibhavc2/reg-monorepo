import ct from '@/constants';
import { database } from '@/db';
import { UserService, apiResponse, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, userSessions, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type RegisterWithEmail =
  (typeof contracts.v1.UserContract)['register-with-email'];
type RegisterWithEmailHandler = AppRouteImplementation<RegisterWithEmail>;

export const registerWithEmailHandler: RegisterWithEmailHandler = async ({
  headers,
  body: { fullName, email, password },
  res,
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

  //? create tokens to login immediately after registration
  // create tokens
  const tokens = jwt.generateAuthTokens(userId, email);

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: userId,
    token: tokens?.refreshToken as string,
    authType: 'email',
    userAgent: headers['user-agent'] ? (headers['user-agent'] as string) : null,
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

  // set the cookies
  res
    .cookie('refreshToken', tokens.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens.accessToken, ct.cookieOptions.auth);

  // return success
  return apiResponse.res(201, 'User registered successfully!', {
    user: {
      ...user[0],
      email,
    },
    tokens,
  });
};