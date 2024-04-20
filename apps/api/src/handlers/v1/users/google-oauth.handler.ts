import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, google, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, userSessions, users, verifications } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GoogleOAuth = (typeof contracts.v1.UsersContract)['google-oauth'];
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

  const { email, name: fullName, picture: avatar } = userInfo;

  const { user, tokens } =
    (await database.db?.transaction(async (tx) => {
      if (!email) return null;

      // check if the user is already registered
      const existingUser = (
        await tx
          .select()
          .from(emailCredentials)
          .where(eq(emailCredentials.email, email))
      )?.[0];

      let userId: number | null = null;

      if (!existingUser) {
        // insert the user
        const userResult = (
          await tx.insert(users).values({
            fullName,
            avatar,
          })
        )?.[0];

        // insert the email credentials
        await tx.insert(emailCredentials).values({
          user: userResult.insertId as number,
          email,
          googleAuth: true,
        });

        // save verification record of the user
        await tx.insert(verifications).values({
          user: userResult.insertId as number,
          emailVerified: true,
        });

        userId = userResult.insertId as number;
      } else {
        // update the user
        await tx
          .update(users)
          .set({ fullName, avatar })
          .where(eq(users.id, existingUser.user));

        userId = existingUser.user;
      }

      // create tokens
      const tokens = jwt.generateAuthTokens(userId, { email });

      // insert the refresh token, and save the session
      await database.db?.insert(userSessions).values({
        user: userId,
        token: tokens?.refreshToken as string,
        authType: 'google',
        userAgent: headers['user-agent']
          ? (headers['user-agent'] as string)
          : null,
      });

      // get the user and email credential to send as data in the response
      const user = (
        await database.db?.select().from(users).where(eq(users.id, userId))
      )?.[0];

      return {
        user,
        tokens,
      };
    }, ct.dbTransactionConfig)) ?? {};

  // set the cookies
  res
    .cookie('refreshToken', tokens?.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens?.accessToken, ct.cookieOptions.auth);

  // return success
  return apiResponse.res(200, 'User authenticated successfully!', {
    user: {
      ...user,
      email,
    },
  });
};
