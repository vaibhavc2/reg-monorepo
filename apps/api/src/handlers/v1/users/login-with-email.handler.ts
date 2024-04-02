import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, userSessions, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { and, eq } from 'drizzle-orm';

type LoginWithEmail = (typeof contracts.v1.UserContract)['login-with-email'];
type LoginWithEmailHandler = AppRouteImplementation<LoginWithEmail>;

export const loginWithEmailHandler: LoginWithEmailHandler = async ({
  headers,
  body: { email, password },
  req: { user },
  res,
}) => {
  // check if the user is already logged in
  if (user) {
    return apiResponse.error(400, 'User already logged in!');
  }

  // verify the credentials
  const creds = await database.db
    ?.select()
    .from(emailCredentials)
    .where(
      and(
        eq(emailCredentials.email, email),
        eq(emailCredentials.password, password),
      ),
    );

  if (!creds || !creds[0] || creds.length !== 1) {
    return apiResponse.error(400, 'Invalid credentials!');
  }

  // get the user
  const myUser = await database.db
    ?.select()
    .from(users)
    .where(eq(users.id, creds[0].user));

  // check if the user is present
  if (!myUser || myUser.length === 0) {
    return apiResponse.serverError();
  }

  // create tokens
  const tokens = jwt.generateAuthTokens(myUser[0].id, email);

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: myUser[0].id,
    token: tokens?.refreshToken as string,
    authType: 'email',
    userAgent: headers['user-agent'] ? (headers['user-agent'] as string) : null,
  });

  // set the cookies
  res
    .cookie('refreshToken', tokens.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens.accessToken, ct.cookieOptions.auth);

  // return success
  return apiResponse.res(200, 'User logged in successfully!', {
    user: {
      ...myUser[0],
      email,
    },
    tokens,
  });
};
