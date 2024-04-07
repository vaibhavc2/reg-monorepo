import ct from '@/constants';
import { database } from '@/db';
import { UserService, apiResponse, google, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { userSessions, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GoogleOAuth = (typeof contracts.v1.UserContract)['google-oauth'];
type GoogleOAuthHandler = AppRouteImplementation<GoogleOAuth>;

export const googleOAuthHandler: GoogleOAuthHandler = async ({
  headers,
  query: { code },
  res,
}) => {
  // get tokens from the code
  const googleAuthTokens = await google.getTokens(code);

  // check if the access token is present
  if (!googleAuthTokens?.access_token) {
    return apiResponse.error(400, 'Invalid user!');
  }

  // get user info from the access token
  const userInfo = await google.getUser(String(googleAuthTokens?.access_token));

  // validate the details of the user
  if (!userInfo?.email || !userInfo?.name) {
    return apiResponse.error(400, 'Invalid user!');
  }

  const { email, name, picture } = userInfo;

  // use user service to upsert the user
  const userService = new UserService(
    {
      fullName: name,
      email,
      avatar: picture,
    },
    true,
  );

  // upsert the user
  const upsertedUser = await userService.upsertGoogleUser();

  // verify the upsreted user
  if (!upsertedUser) {
    return apiResponse.serverError();
  }

  const { userId } = upsertedUser;

  // create tokens
  const tokens = jwt.generateAuthTokens(userId, { email });

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: userId,
    token: tokens?.refreshToken as string,
    authType: 'google',
    userAgent: headers['user-agent'] ? (headers['user-agent'] as string) : null,
  });

  // get the user and email credential to send as data in the response
  const user = await database.db
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
  return apiResponse.res(200, 'User authenticated successfully!', {
    user: {
      ...user[0],
      email,
    },
  });
};
