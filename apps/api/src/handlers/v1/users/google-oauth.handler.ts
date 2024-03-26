import ct from '@/constants';
import { db } from '@/db';
import { UserService, google, jwt } from '@/services';
import { ApiError, getCookieString } from '@/utils';
import { contracts } from '@reg/contracts';
import { userSessions, users, verifications } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GoogleOAuth = (typeof contracts.v1.UserContract)['google-oauth'];
type GoogleOAuthHandler = AppRouteImplementation<GoogleOAuth>;

export const googleOAuthHandler: GoogleOAuthHandler = async ({
  query: { code },
  headers: { 'User-Agent': userAgent },
}) => {
  try {
    // get tokens from the code
    const googleAuthTokens = await google.getTokens(code);

    // check if the access token is present
    if (!googleAuthTokens?.access_token) {
      return {
        status: 400 as 400,
        body: {
          status: 400,
          message: 'Invalid user!',
        },
      };
    }

    // get user info from the access token
    const userInfo = await google.getUser(
      String(googleAuthTokens?.access_token),
    );

    // validate the details of the user
    if (!userInfo?.email || !userInfo?.name) {
      return {
        status: 400 as 400,
        body: {
          status: 400,
          message: 'Invalid user!',
        },
      };
    }

    const { email, name, picture } = userInfo;

    // use user service to upsert the user
    const userService = new UserService(name, email, undefined, picture);

    // upsert the user
    const upsertedUser = await userService.upsertUser();

    // verify the upsreted user
    if (!upsertedUser) {
      throw new ApiError(500);
    }

    const { userId } = upsertedUser;

    // create tokens
    const tokens = await jwt.generateAuthTokens(userId, email);

    // insert the refresh token, and save the session
    await db?.insert(userSessions).values({
      user: userId,
      token: tokens?.refreshToken as string,
      authType: 'google',
      userAgent: userAgent ? (userAgent as string) : null,
    });

    // save verification record of the user
    await db?.insert(verifications).values({
      user: userId,
      emailVerified: true,
    });

    // get the user and email credential to send as data in the response
    const user = await db?.select().from(users).where(eq(users.id, userId));

    // check if the user is present
    if (!user || user.length === 0) {
      throw new ApiError(500);
    }

    // return success
    return {
      status: 200 as 200,
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
        status: 200,
        data: {
          user: {
            ...user[0],
            email,
          },
        },
        message: 'User signed up successfully',
      },
    };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong!', error);
  }
};
