import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, emailService, jwt, names, pwd } from '@/services';
import { contracts } from '@reg/contracts';
import {
  emailCredentials,
  emailValidations,
  userSessions,
  users,
  verifications,
} from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type RegisterWithEmail =
  (typeof contracts.v1.UserContract)['register-with-email'];
type RegisterWithEmailHandler = AppRouteImplementation<RegisterWithEmail>;

export const registerWithEmailHandler: RegisterWithEmailHandler = async ({
  headers,
  body: { email, password },
  req: { user: loggedInUser },
  res,
}) => {
  // check if the user is already logged in
  if (loggedInUser) {
    return apiResponse.error(400, 'User already logged in!');
  }

  // check if the user is already registered
  const existingUser = (
    await database.db
      ?.select()
      .from(emailCredentials)
      .where(eq(emailCredentials.email, email))
  )?.[0];

  if (existingUser) {
    return apiResponse.error(400, 'User already exists!');
  }

  // check if the email is verified earlier
  const emailValidation = (
    await database.db
      ?.select()
      .from(emailValidations)
      .where(eq(emailValidations.email, email))
  )?.[0];

  if (
    !emailValidation ||
    !emailValidation.verified ||
    emailValidation.disabled
  ) {
    return apiResponse.error(403, 'Verify email first!');
  }

  const fullName = names.generateRandomName();

  // return db transaction
  const { user, tokens } =
    (await database.db?.transaction(async (tx) => {
      // check if the user is already registered
      const existingUser = (
        await tx
          .select()
          .from(emailCredentials)
          .where(eq(emailCredentials.email, email))
      )?.[0];

      if (existingUser) return null;

      // insert the user
      const userResult = (
        await tx.insert(users).values({
          fullName,
        })
      )?.[0];

      const userId = userResult?.insertId as number;

      // insert the email credentials
      await tx.insert(emailCredentials).values({
        user: userId,
        email,
        password: (await pwd.hash(password as string)) as string,
      });

      // save verification record of the user
      await tx.insert(verifications).values({
        user: userId,
      });

      // create tokens
      const tokens = jwt.generateAuthTokens(userId, { email });

      // insert the refresh token, and save the session
      await tx.insert(userSessions).values({
        user: userId,
        token: tokens?.refreshToken as string,
        authType: 'email',
        userAgent: headers['user-agent']
          ? (headers['user-agent'] as string)
          : null,
      });

      // get the user to send as data in the response
      const user = (
        await tx?.select().from(users).where(eq(users.id, userId))
      )?.[0];

      return {
        user,
        tokens,
      };
    }, ct.dbTransactionConfig)) ?? {};

  // send the verification email
  const response = await emailService.sendVerificationEmail(
    email,
    jwt.generateVerificationToken({ userId: user?.id as number }),
  );

  // check if email was sent
  if (!response) {
    return apiResponse.serverError(
      'Try Logging In! Failed to send verification email!',
    );
  }

  // set the cookies
  res
    .cookie('refreshToken', tokens?.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens?.accessToken, ct.cookieOptions.auth);

  // return success
  return apiResponse.res(
    201,
    'User registered successfully! Check your email to verify.',
    {
      user: {
        ...user,
        email,
      },
      tokens,
    },
  );
};
