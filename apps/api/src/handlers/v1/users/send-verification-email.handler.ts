import { database } from '@/db';
import { apiResponse, emailService, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type SendVerificationEmail =
  (typeof contracts.v1.UserContract)['send-verification-email'];
type SendVerificationEmailHandler =
  AppRouteImplementation<SendVerificationEmail>;

export const sendVerificationEmailHandler: SendVerificationEmailHandler =
  async ({ req: { user } }) => {
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

    // return success
    return apiResponse.res(200, 'Success! Email sent!');
  };
