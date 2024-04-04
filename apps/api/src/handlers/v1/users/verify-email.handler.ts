import { database } from '@/db';
import { apiResponse, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { verifications } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type VerifyEmail = (typeof contracts.v1.UserContract)['verify-email'];
type VerifyEmailHandler = AppRouteImplementation<VerifyEmail>;

export const verifyEmailHandler: VerifyEmailHandler = async ({
  req: { user },
  query: { token },
}) => {
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

  // return success
  return apiResponse.res(200, 'Success! Email verified!');
};
