import { database } from '@/db';
import { apiResponse, emailService, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type SendVerificationEmail =
  (typeof contracts.v1.UserContract)['send-verification-email'];
type SendVerificationEmailHandler =
  AppRouteImplementation<SendVerificationEmail>;

export const sendVerificationEmailHandler: SendVerificationEmailHandler =
  async ({ req: { user }, query: { login: _login }, body: { email } }) => {
    const login = _login === 'true'; // verification for login using email without password

    if (!login) {
      // check if the user is present
      if (!user || !user.id) {
        return apiResponse.error(401, 'Unauthorized!');
      }

      // get user email
      const creds = await database.db
        ?.select({
          email: emailCredentials.email,
        })
        .from(emailCredentials)
        .where(eq(emailCredentials.user, user.id));

      // check if email is present
      if (!creds || creds.length === 0) {
        return apiResponse.error(400, 'Email not found!');
      }

      // send the verification email
      const response = await emailService.sendVerificationEmail(
        creds[0].email,
        jwt.generateVerificationToken(user.id),
      );

      // check if email was sent
      if (!response) {
        return apiResponse.serverError();
      }
    } else {
      // check if not already logged in
      if (user) {
        return apiResponse.error(400, 'User already logged in!');
      }

      // check if email is present
      if (!email) {
        return apiResponse.error(400, 'Email not found!');
      }

      // get the user creds
      const creds = await database.db
        ?.select()
        .from(emailCredentials)
        .where(eq(emailCredentials.email, email));

      // check if creds are present
      if (!creds || creds.length === 0) {
        return apiResponse.error(400, 'Invalid email!');
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

      // send the verification email and login during verification
      const response = await emailService.sendVerificationEmail(
        creds[0].email,
        jwt.generateVerificationToken(myUser[0].id),
        {
          login: true, // login the user after verification
        },
      );

      // check if email was sent
      if (!response) {
        return apiResponse.serverError();
      }
    }

    // return success
    return apiResponse.res(200, 'Check your email for verification link!');
  };
