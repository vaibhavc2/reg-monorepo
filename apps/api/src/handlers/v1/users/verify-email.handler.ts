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
      ?.select({
        verified: emailValidations.verified,
        email: emailValidations.email,
      })
      .from(emailValidations)
      .where(eq(emailValidations.email, email));

    // check if the email is present
    if (!result || !result[0] || result[0].email !== email) {
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
    if (!update) {
      return apiResponse.serverError();
    }

    // return success
    return apiResponse.res(200, 'Email verified successfully!');
  } else {
    // check if the user is present
    if (!user || !user.id) {
      return apiResponse.error(401, 'Unauthorized!');
    }

    // verify the token
    const { id } = jwt.verifyVerificationToken(token) ?? {};

    // verify the user id
    if (id !== user.id) {
      return apiResponse.error(400, 'Invalid token!');
    }

    // update the user's email verification status
    const result = await database.db
      ?.update(verifications)
      .set({
        emailVerified: true,
      })
      .where(eq(verifications.user, user.id));

    // check if the update was successful
    if (!result) {
      return apiResponse.serverError();
    }

    // check if the user wants to login
    if (login !== 'true') {
      // return success
      return apiResponse.res(200, 'Success! Email verified!');
    }

    // login the user
    // get the user email
    const creds = await database.db
      ?.select({
        email: emailCredentials.email,
      })
      .from(emailCredentials)
      .where(eq(emailCredentials.user, user.id));

    // check if the email is present
    if (!creds || !creds[0]) {
      return apiResponse.error(400, 'Invalid user!');
    }

    // create tokens
    const tokens = jwt.generateAuthTokens(user.id, { email: creds[0]?.email });

    // insert the refresh token, and save the session
    await database.db?.insert(userSessions).values({
      user: user.id,
      token: tokens?.refreshToken as string,
      authType: 'email',
      userAgent: headers['user-agent']
        ? (headers['user-agent'] as string)
        : null,
    });

    // set the cookies
    res
      .cookie('refreshToken', tokens.refreshToken, ct.cookieOptions.auth)
      .cookie('accessToken', tokens.accessToken, ct.cookieOptions.auth);

    // return success
    return apiResponse.res(200, 'User logged in successfully!', {
      user: {
        ...user,
        email: creds[0]?.email,
      },
      tokens,
    });
  }
};
