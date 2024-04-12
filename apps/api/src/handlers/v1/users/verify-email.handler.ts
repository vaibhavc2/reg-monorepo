import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import {
  emailCredentials,
  emailValidations,
  userSessions,
  verifications,
} from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type VerifyEmail = (typeof contracts.v1.UserContract)['verify-email'];
type VerifyEmailHandler = AppRouteImplementation<VerifyEmail>;

export const verifyEmailHandler: VerifyEmailHandler = async ({
  res,
  req: { user },
  query: { token, login, newUser },
  headers,
}) => {
  if (newUser === 'true') {
    // new user, so verify and save to validations record
    // verify the token
    const { email } = jwt.verifyVerificationToken(token) ?? {};

    // check if the email is present
    if (!email) {
      return apiResponse.error(400, 'Invalid token!');
    }

    // find the email from the email validations record
    const result = await database.db
      ?.select()
      .from(emailValidations)
      .where(eq(emailValidations.email, email));

    // check if the email is present
    if (
      !result ||
      !result[0] ||
      result[0].email !== email ||
      result[0].disabled
    ) {
      return apiResponse.error(400, 'Invalid email!');
    }

    // check if the email is already verified
    if (result[0].verified) {
      return apiResponse.error(400, 'Email already verified!');
    }

    // update the email validations record
    const update = await database.db
      ?.update(emailValidations)
      .set({
        verified: true,
      })
      .where(eq(emailValidations.email, email));

    // check if the update was successful
    if (!update || !update[0].affectedRows || update[0].affectedRows !== 1) {
      return apiResponse.serverError();
    }

    // return success
    return apiResponse.res(200, 'Email verified successfully!');
  } else {
    // check if the user is present
    if (!user || !user.id) {
      return apiResponse.error(401, 'Unauthorized!');
    }

    const userId = user.id as number;

    // verify the token
    const { id } = jwt.verifyVerificationToken(token) ?? {};

    // verify the user id
    if (id !== userId) {
      return apiResponse.error(400, 'Invalid token!');
    }

    // start db transaction
    const { message, tokens, email } =
      (await database.db?.transaction(async (tx) => {
        // update the user's email verification status
        await tx
          .update(verifications)
          .set({
            emailVerified: true,
          })
          .where(eq(verifications.user, userId));

        // check if the user wants to login
        if (login !== 'true') {
          // return success
          return { message: 'Success! Email verified!' };
        }

        // login the user
        // get the user email
        const creds = (
          await tx
            .select({
              email: emailCredentials.email,
            })
            .from(emailCredentials)
            .where(eq(emailCredentials.user, userId))
        )?.[0];

        // create tokens
        const tokens = jwt.generateAuthTokens(userId, { email: creds?.email });

        // insert the refresh token, and save the session
        await tx.insert(userSessions).values({
          user: userId,
          token: tokens?.refreshToken as string,
          authType: 'email',
          userAgent: headers['user-agent']
            ? (headers['user-agent'] as string)
            : null,
        });

        return { tokens, email: creds?.email };
      }, ct.dbTransactionConfig)) ?? {};

    if (message) return apiResponse.res(200, message);

    // set the cookies
    res
      .cookie('refreshToken', tokens?.refreshToken, ct.cookieOptions.auth)
      .cookie('accessToken', tokens?.accessToken, ct.cookieOptions.auth);

    // return success
    return apiResponse.res(200, 'User logged in successfully!', {
      user: {
        ...user,
        email,
      },
      tokens,
    });
  }
};
